export type ApplicationConfig = {
  httpServer: {
    port: number;
    logLevel: string;
  };
  telegram: {
    baseUrl: string;
    botToken: string;
    secretHeaderToken: string;
  };
};

export type TelegramMessageUpdate = {
  update_id: number;
  message: {
    message_id: number;
    from: {
      id: number;
      is_bot: false;
      first_name: string;
      last_name: string;
      username: string;
      language_code: string;
    };
    chat: {
      id: number;
      first_name: string;
      last_name: string;
      username: string;
      type: string;
    };
    date: number;
    text: string;
  };
};

export type TelegramCallbackQueyUpdate = {
  update_id: number;
  callback_query: {
    id: string;
    from: {
      id: number;
      is_bot: false;
      first_name: string;
      last_name: string;
      username: string;
      language_code: string;
    };
    message: {
      message_id: number;
      from: {
        id: number;
        is_bot: false;
        first_name: string;
        username: string;
      };
      chat: {
        id: number;
        first_name: string;
        last_name: string;
        username: string;
        type: string;
      };
      date: number;
      text: string;
    };
    data: string;
  };
};

export type HandleSocketEvent = (data: any) => Promise<void>;
