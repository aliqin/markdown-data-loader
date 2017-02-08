import fs from 'fs';
import path from 'path';

import YFM from 'yaml-front-matter';
import loaderUtils from 'loader-utils';
import markdown from 'markdown-it';

import cache from './cache';
import genId from './gen-id';

/**
 * convert markdown to object
 */
function process(source){
  console.log(this);
  //get meta
  let raw,content,meta;

  raw = YFM.loadFront(source);
  content = raw.__content;
  delete raw.__content;
  meta = raw;

  const markupReg = /\`{3,}jsx([\s\S]*?)\`{3,}/;
  const codeReg = /\`{3,}vue\-script([\s\S]*?)\`{3,}/;
  const langArr = ['zh-CN', 'en-US'];
  const defLang = langArr[0];
  //doc ## zh-CN
  const regStr = '\#{2,}\\s*(' + langArr.join('|') + ')';
  const docRegs = new RegExp(regStr,i);

  let doc = {};
  let markup = '';
  let code = '';

  // derive markup
  content = content.replace(markupReg, function(match, $1){
    markup = $1;
    return '';
  });

  // derive code
  content = content.replace(codeReg, function(match, $1){
    code = $1;
    return '';
  });

  // derive doc
  // ['','zh-CN','\n\n一级按钮\n\n','en-US',"\n\nprimary button"]
  let docs = content.split(docRegs);
  // delete blank string
  docs.shift();
  // Grouping by Internationalization
  for(var i=0,len=docs.length/2;i<=len;i+=2){
    doc[docs[i]] = docs[i+1];
  }

  let target = {
    meta:meta,
    markup:markup,
    code:code,
    doc:doc
  }

  return target
}

module.exports = function(source){
  this.cacheable()

  let target = process(source);
  // highlight it
  

  return 'module.exports = ' + JSON.stringify(target);
}