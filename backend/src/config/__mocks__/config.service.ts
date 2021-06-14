interface MockConfigService {
  get(key: string): string;
}
interface ConfigServiceMockExport {
  configService: MockConfigService;
}

const configService = {
  get: (key: string): string => {
    if (key === "NODE_ENV") return "development";
    return key;
  },
};

export { configService };
export default (): ConfigServiceMockExport => ({
  configService,
});
