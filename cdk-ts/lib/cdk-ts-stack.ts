import * as cdk from 'aws-cdk-lib';
import { aws_cloudfront as cloudfront, aws_s3 as s3, aws_iam as iam, aws_s3_deployment as s3deploy } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class StackCSKTask2 extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const OAI = new cloudfront.OriginAccessIdentity(this, 'react-app-OAI')
    // Create an S3 bucket
    const bucket = new s3.Bucket(this, 'MyReactAppBucket', {
      websiteIndexDocument: 'index.html',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [bucket.arnForObjects('*')],
      principals: [new iam.CanonicalUserPrincipal(OAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)],

      effect: iam.Effect.ALLOW,
      conditions: {
        StringEquals: {
          'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/*`
        }
      }
    }));

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'MyReactAppDistribution', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: bucket,
          originAccessIdentity: OAI,
        },
        behaviors: [{
          isDefaultBehavior: true,
        }]
      }],
    });


    new s3deploy.BucketDeployment(this, 'DeployReactApp', {
      sources: [s3deploy.Source.asset('../dist')],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });

    new cdk.CfnOutput(this, 'BucketURL', { value: bucket.bucketWebsiteUrl });
    new cdk.CfnOutput(this, 'CloudFrontURL', { value: distribution.distributionDomainName });
  }
}