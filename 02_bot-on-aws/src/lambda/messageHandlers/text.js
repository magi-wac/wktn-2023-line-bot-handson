export const textMessageHandler = async (event) => {
  console.debug(`textMessageHandler called!: ${JSON.stringify(event)}`);
  const replyMessage = { type: 'text', text: event.message.text };
  return replyMessage;
};
