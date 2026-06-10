import * as amqp from 'amqplib';
import { randomUUID } from 'crypto';

let connection: any = null;
let channel: amqp.Channel | null = null;

const rabbitmqUrl =
  process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

const exchangeName =
  process.env.RABBITMQ_EXCHANGE || 'facoffee.users';

async function getChannel(): Promise<amqp.Channel> {
  if (channel) {
    return channel;
  }

  connection = await amqp.connect(rabbitmqUrl);
  channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, 'topic', {
    durable: true,
  });

  return channel;
}

export async function publishDomainEvent(
  routingKey: string,
  payload: unknown
) {
  const currentChannel = await getChannel();

  const event = {
    id: randomUUID(),
    routingKey,
    occurredAt: new Date().toISOString(),
    payload,
  };

  currentChannel.publish(
    exchangeName,
    routingKey,
    Buffer.from(JSON.stringify(event)),
    {
      contentType: 'application/json',
      persistent: true,
      messageId: event.id,
      timestamp: Date.now(),
    }
  );

  return event;
}