import {InputMetadataWalker} from "codelyzer/noInputRenameRule";
import {Input} from "@angular/core";
/**
 * Created by frdiaz on 14/12/2016.
 */

export class JobModel {

  public urlJobExecution: string;
  public lastExecTime: number;
  public lastExecNumber: number;
  public displayLastExecNumber: string;
  public result: string;
  public timestamp: number;

  constructor( public name:string, public urlJob:string){}
}
