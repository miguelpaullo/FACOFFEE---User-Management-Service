import { UserDeactivatedConsumer } from './events/UserDeactivatedConsumer';

const consumer =
  new UserDeactivatedConsumer();

consumer.start();