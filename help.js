

const help = {
  sää: "Use the command by writing /saa <place> <parameters>.\nValid parameters are: lampotila, sade, lumi\nHere is an example of use: </saa pori lampotila sade lumi>",
  vesi: "BlaBlaBlaBla"
}

const generateHelp = param => {
   try {
     return help(param)
   } catch (e) {
     console.log(e)
     return "Try to use proper command i.e. </help saa> or </help vesi>"
   }
}

export default generateHelp
