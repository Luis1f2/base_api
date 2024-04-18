const express = require("express");
const cors = require("cors")
const bodyParser = require('body-parser');
const dbConfig = require("./src/config/db.config")
const rateLimit = require("express-rate-limit");
const app = express();


const accountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 6, // limita cada IP a 6 peticiones por el tiempo definido con "windowMs"
    message: "Demasiadas peticiones realizadas, intenta despues de 1 hora"
}); 


let corsOption = {
    origin: "http://localhost:3030"
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({extended : true}));


const db = require("./src/models");
const Role = db.role;


db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
.then(() => {
    console.log("Exito al conectar con mongo db");
    initial();
})
    .catch(err => {
    console.error("error al conectar", err);
    process.exit();
});

app.get("/",accountLimiter,(req,res)=>{
    res.json({message:"Bienbenidos a HaiMusic API"})
})


require('./src/routers/auth.routes')(app);
require('./src/routers/user.routes')(app);
require('./src/routers/song.routes')(app);
require('./src/routers/artist.routes')(app);
require('./src/routers/disk.routes')(app);
require('./src/routers/lenguage.routes')(app);


const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto: ${PORT}.`);
});

async function initial() {
    try{
      const count = await Role.estimatedDocumentCount();
      if(count === 0){
        await Promise.all([
          new Role({name: "user"}).save(),
          new Role({name: "admin"}).save()
        ])
        console.log("Roles activados e iniciados");
      }
      }catch (error){
        console.error("error al iniciar los roles checalo",error);
  }
  
  }

  const uploadRoutes = require('./src/routers/upload.routes');

  // Middleware para parsear el cuerpo de las peticiones JSON
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  // Configuración básica de CORS para permitir ciertas cabeceras y métodos
  app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
      next();
  });
  
  // Usando las rutas importadas
  app.use('/api/V3', uploadRoutes);
  
  // Middleware de manejo de errores generales
  app.use((err, req, res, next) => {
      console.error(err.stack); // Log del error para el servidor
      res.status(500).send('Something broke!');
  });



