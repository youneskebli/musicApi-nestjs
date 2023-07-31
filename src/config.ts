/* eslint-disable prettier/prettier */
export const config = {
    db: {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'music-land',
      username: 'postgres',
      password: 'esi37021108',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    },
    aws: {
      AWS_S3_BUCKET_NAME: 'youapp-api',
      ACCESS_KEY_ID: 'AKIATDRMT6WBEP2ECPFV',
      SECRET_ACCESS_KEY: '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',
      cdnUrl: 'https://youapp.api.s3.us-east-1.amazonaws.com',
    },

    nodeMailerOptions: {
      transport: {
        service:'gmail',
        host:'smtp.gmail.com',
        port:465,
        secure:true,
        auth: {
          user:'y.kebli@esi-sba.dz',
          pass:'ajajsevpwatxhibs'
        },
        tls: {
          rejectUnauthorized: true
        }
      }
    },

    frontEndKeys: {
      url: 'localhost',
      port: 4200,
      endpoints: ['auth/reset-password', 'auth/verify-email'],
    },
};








