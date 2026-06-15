import amqp from 'amqplib';

export class UserDeactivatedConsumer {
  async start() {
    const connection = await amqp.connect(
      'amqp://facoffee:facoffee@localhost:5672'
    );

    const channel = await connection.createChannel();

    await channel.assertExchange(
      'domain.events',
      'topic',
      { durable: true }
    );

    const queue = await channel.assertQueue(
      'users.deactivated.queue',
      {
        durable: true,
      }
    );

    await channel.bindQueue(
      queue.queue,
      'domain.events',
      'users.deactivated'
    );

    console.log(
      'Consumer escutando users.deactivated...'
    );

    channel.consume(
      queue.queue,
      message => {
        if (!message) return;

        const event = JSON.parse(
          message.content.toString()
        );

        console.log(
          '\n===== EVENTO RECEBIDO ====='
        );

        console.log(
          JSON.stringify(
            event,
            null,
            2
          )
        );

        console.log(
          '===========================\n'
        );

        channel.ack(message);
      }
    );
  }
}