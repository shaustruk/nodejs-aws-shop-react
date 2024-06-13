#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StackCSKTask2 } from '../lib/cdk-ts-stack';

const app = new cdk.App();
new StackCSKTask2(app, 'StackCSKTask2');
