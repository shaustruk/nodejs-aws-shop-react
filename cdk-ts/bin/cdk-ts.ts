#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkTsStackTask2 } from '../lib/cdk-ts-stack';

const app = new cdk.App();
new CdkTsStackTask2(app, 'CdkTsStackTask2');
