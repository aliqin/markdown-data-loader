var fs = require('fs')
var exec = require('child_process').exec

fs.watch('./src/', () => {
  exec('npm run build', (err, stdout, stderr) => {
    if(err){
      console.error(err)
    }else{
      console.log(stdout)
    }
  })
})