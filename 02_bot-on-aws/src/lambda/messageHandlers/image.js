export const imageMessageHandler = async (event) => {
  console.debug(`imageMessageHandler called!: ${JSON.stringify(event)}`);
  const replyMessage = { type: 'text', text: event.message.text };
  return replyMessage;
};
