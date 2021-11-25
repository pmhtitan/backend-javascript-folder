'use strict'

var Project = require('../models/project');
var fs = require('fs'); // fileSystem 
var path = require('path'); 

var controller = {
    home: function(req,resp){
        return resp.status(200).send({
            message: 'Soy la home'
        });
    },
    test: function(req, resp){  
        return resp.status(200).send({
            message: 'Soy el método o acción test del controlador de project'
        });
    },
    // save
    saveProject: function(req,resp){
        var proyecto = new Project();

        var params = req.body;
        proyecto.name = params.name;
        proyecto.description = params.description;
        proyecto.category = params.category;
        proyecto.year = params.year;
        proyecto.langs = params.langs;
        proyecto.image = null;

        proyecto.save((err, projectStored) => {
            if(err) return resp.status(500).send({ message: 'Error al guardar'});

            if(!projectStored) return resp.status(404).send({ message: 'No se ha podido guardar el proyecto'});

            return resp.status(200).send({ project: projectStored })
        });

        /* return resp.status(200).send({
            params: params,
            project: proyecto,
            message: 'Método save project'
        }); */
    },
    // get one
    getProject: function(req,res){
        var projectId = req.params.id;

        if(projectId == null){
            return res.status(404).send({ message: 'El producto no existe (null)'});
        } 

        Project.findById(projectId,(err, objeto) =>{
            if(err) return res.status(500).send({ message: 'Error al devolver los datos'});
            if(!objeto) return res.status(404).send({ message: 'El producto no existe'});

            return res.status(200).send({ project: objeto })
        });
    },
    // get all
    getProjects: function(req,res){
        Project.find({}).sort('-year').exec((err, projects) => {
            if(err) return res.status(500).send({ message: 'Error al devolver los datos.'});
            if(!projects) return res.status(404).send({ message: 'No hay proyectos para mostrar'});
            
            return res.status(200).send({ projects });
        });
    },
    // update
    updateProject: function(req,res){
        var projectId = req.params.id;
        var update = req.body; // objeto completo con los datos ya actualizados
        
        Project.findByIdAndUpdate(projectId, update, {new: true}, (err, projectUpdated) => {
            if(err) return res.status(500).send({ message: 'Error al actualizar'});
            if(!projectUpdated) return res.status(404).send({ message: 'No existe el proyecto para actualizar'});

            return res.status(200).send({
                 project: projectUpdated,
                 message: 'Proyecto actualizado'
                });
        })
    },
    // delete
    deleteProject: function(req,res){
        var projectId = req.params.id;

        Project.findByIdAndRemove(projectId, (err, projectRemoved) => {
            if(err) return res.status(500).send({ message: 'Error al borrar'});
            if(!projectRemoved) return res.status(404).send({ message: 'No existe el proyecto indicado'});

            return res.status(200).send({
                project: projectRemoved,
                message: "Proyecto eliminado"
            });
        });
    },
    // subir imagenes
    uploadImage: function(req,res){
        var projectId = req.params.id;
        var fileName = 'Imagen no subida...';

        if(req.files){
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[1];
            var extSplit = fileName.split('.');
            var fileExt = extSplit[1];

            if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                Project.findByIdAndUpdate(projectId, {'image': fileName}, (err, projectUpdated)=>{
                  if(err) return res.status(500).send({message: 'La imagen no se ha subido, error'});
                  if(!projectUpdated) return res.status(404).send({message: 'Project no encontrado'});
                  
                  //--------- Unlink de imagen anterior
                  //La funcion fs.existsSync verifica la existencia de archivos
                  if(projectUpdated.image && fs.existsSync('uploads/'+projectUpdated.image)){
                    fs.unlink('uploads/'+projectUpdated.image, (err)=>{
                      return res.status(200).send({message: 'La imagen ya existía con ese nombre'});
                    });
                  }else{                  
                  //Como estoy usando el objeto anterior de la base(no el actualizado)
                  //Simplemente actualizo el modelo para imprimirlo con el nombre de la nueva imagen en el response
                  projectUpdated.image = fileName;
                  return res.status(200).send({ project: projectUpdated });
                  }
                });
              }else{
                fs.unlink(filePath, (err)=>{
                  return res.status(200).send({ message: 'Extension no válida' });
                });
              }
            }else{
              return res.status(200).send({ message: fileName });
            }
    },

    // get Image file
    getImageFile(req,res){
        var file = req.params.image;
        var path_file = './uploads/'+file;

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({ message: 'No existe la imagen...'});
            }
        });
    }

     
};

module.exports = controller;