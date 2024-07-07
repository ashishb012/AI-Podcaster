// Replace the domain with your own clerk domain
// Clerk -> API keys -> Show API URL -> Frontend API URL

const authConfig = {
  providers: [
    {
      domain: "https://eager-grouper-39.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
export default authConfig;
