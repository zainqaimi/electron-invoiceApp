declare global {
  interface Window {
    electron: {
      fs: {
        existsSync: (path: string) => boolean;
        readFileBase64: (filePath: string) => string | null;
      };
      path: {
        join: (...args: string[]) => string;
      };
      ipcRenderer: {
        invoke: (...args: any[]) => any;
        on: (...args: any[]) => any[];
        send: (...args: any[]) => void;
      };
      backup: {
        create: () => Promise<string>;
        restore: (backupFile: string) => Promise<void>;
      };
    };
    api: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      send: (channel: string, ...args: any[]) => void;
      on: (
        channel: string,
        callback: (event: any, ...args: any[]) => void
      ) => void;
    };
    users: {
      getUsers: () => Promise<any[]>;
      addUser: (user: any) => Promise<any>;
      editUser: (user: any) => Promise<any>;
      deleteUser: (id: number) => Promise<any>;
      loginUser: (data: {
        email: string;
        password: string;
      }) => Promise<{ success: boolean; message: string }>;
      logoutUser: () => Promise<void>;
      isLogin: () => Promise<boolean>;
    };
    purchase: {
      create: (bill: any) => Promise<any>;
      getAll: () => Promise<any>;
      getById: (billId: number) => Promise<any>;
      delete: (billId: number) => Promise<any>;
    };
  }
}
