export {};

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke(channel: string, ...args: any[]): Promise<any>;
        on(channel: string, listener: (...args: any[]) => void): void;
        send(channel: string, ...args: any[]): void;
      };
      path: {
        join(...paths: string[]): string;
      };
      fs: {
        existsSync(path: string): boolean;
      };
      backup: {
        create: () => Promise<string>;
        restore: (backupFile: string) => Promise<void>;
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
    };
  }
}
