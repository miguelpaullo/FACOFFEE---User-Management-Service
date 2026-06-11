import amqp from 'amqplib';
import crypto from 'crypto';

export class UserDeactivatedPublisher {
  async publish(userId: string, reason: string) {
    const connection = await amqp.connect(
      'amqp://facoffee:facoffee@localhost:5672'
    );

    const channel = await connection.createChannel();

    const event = {
      eventId: `evt_${crypto.randomUUID()}`,
      eventType: 'UserDeactivated',
      occurredAt: new Date().toISOString(),
      version: '1.0',
      payload: {
        userId,
        reason,
      },
    };

    channel.publish(
      'domain.events',
      'users.deactivated',
      Buffer.from(JSON.stringify(event)),
    );

    console.log('UserDeactivated publicado');

    await channel.close();
    await connection.close();
  }
}