import { generateAuth0Strategy } from "./auth0Strategy";
import { generateDiscordStrategy } from "./discordStrategy";
import { generateFacebookStrategy } from "./facebookStrategy";
import { generateFormStrategy } from "./formStrategy";
import { generateGithubStrategy } from "./githubStrategy";
import { generateGoogleStrategy } from "./googleStrategy";
import { generateMicrosoftStrategy } from "./microsoftStrategy";
import { generateOAuth2Strategy } from "./oAuth2Strategy";
import { generateTwitterStrategy } from "./twitterStrategy";

export const AUTH_STRATEGIES = {
  github: generateGithubStrategy(),
  twitter: generateTwitterStrategy(),
  oauth2: generateOAuth2Strategy(),
  auth0: generateAuth0Strategy(),
  discord: generateDiscordStrategy(),
  google: generateGoogleStrategy(),
  facebook: generateFacebookStrategy(),
  microsoft: generateMicrosoftStrategy(),
  form: generateFormStrategy(),
};

export type AUTH_STRATEGIES_KEYS = keyof typeof AUTH_STRATEGIES;
