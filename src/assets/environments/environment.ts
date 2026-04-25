export const environment = {
  production: true,
  URL_GMAIL: 'mailto:cesarhuesca.dev@gmail.com',
  URL_LINKEDIN: 'https://www.linkedin.com/in/cesarhuesca-dev/',
  URL_GITHUB: 'https://github.com/cesarhuesca-dev',
  URL_DISCORD: 'https://discord.com/users/rayoces_7029',
  URL_API: (window as any).env?.['HOST_BACKEND_API'] || 'http://localhost/api',
  URL_WS: (window as any).env?.['HOST_BACKEND'] || 'http://localhost',
  URL_FRONT: (window as any).env?.['URL_FRONT'] || 'http://localhost',
};
