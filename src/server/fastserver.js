const {exec} = require("child_process");
const React = require("react");
var ReactDOMServer = require('react-dom/server');


require("@xarc/fastify-server")({
  plugins: {
    routes: {
      register: async instance => {
        instance.route({
          method: "GET",
          path: "/",
          handler: async () => "Hello World"
        });
        instance.route({
          method: "GET",
          path: "/rng",
          handler: async (req,res) => new Uint8Array(2<<16).map(_=>~~(Math.random()*8) ).join("")
              
        });
        instance.route({
          method: "GET",
          path: "/ls",
          handler: async (request,reply) => {
            console.log(request.raw.params)
            reply.code(200).send(JSON.stringify(request.raw.params))
          }
        });

        instance.route({
          http2: true,
          method: "GET",
          path: "/music/list",
          handler: async (request,reply) => {
           const {exec} = require("child_process");
            var str=exec("ls ../../../grepaudio/samples/ |grep mp3",(err,stdout) => {
              if(err) reply.code(500);
              reply.send(stdout)
            })
          }
        });

        instance.route({
          http2: true,
          method: "GET",
          path: "/sql",
          handler: async (request,reply) => {
            const ReactDOMServer = require('react-dom/server');
            console.log(request.query['start']);
            const sql="select * from rnc_genome_mapping limit 10 offset "+parseInt(request.query['start'] || 0);
            exec(`psql postgres://reader:NWDMCE5xdipIjRrp@hh-pgsql-public.ebi.ac.uk:5432/pfmegrnargs -c '${sql}' --html`, (err,stdout) => {
              if(err) reply.code(500);
              reply.header("Content-Type","text/html");

              reply.send(ReactDOMServer.renderToStaticMarkup( 
                React.createElement("div",{
                  dangerouslySetInnerHTML:  {
                    __html:stdout+" <a href='/sql?start="+ (parseInt(request.query['start'] || 0) + 10) +"'> next 10</a>"
                  }
                })
              ));
            });
          }
        });
      }
    }
  }
});

        

