import {Router} from 'express'
import pool from '../database.js'

const router = Router();
router.get('/add', async(req,res)=>{
    const [roles]=await pool.query('SELECT * FROM tipo_persona');
    res.render('personas/add', {tipos_persona:roles});
});
router.post('/add', async(req,res)=>{
    try{
        const{name, lastname, age, Tipo_Persona} = req.body;
        const newPersona = {
            name, lastname, age, Tipo_Persona
        }
        await pool.query('INSERT INTO personas SET ?', [newPersona]);
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});
router.get('/list', async(req, res)=>{
    try{
        const[result] = await pool.query('SELECT * FROM personas');
        res.render('personas/list', {personas: result});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});
router.get('/edit/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        const [roles]=await pool.query('SELECT * FROM tipo_persona');
        const [persona] = await pool.query('SELECT * FROM personas WHERE id = ?', [id]);
        const personaEdit = persona[0];
        res.render('personas/edit',{persona: personaEdit, tipos_persona:roles});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})
router.post('/edit/:id', async(req,res)=>{
    try{
        const {name, lastname, age, Tipo_Persona} = req.body;
        const {id} = req.params;
        const editPersona = {name, lastname, age, Tipo_Persona};
        await pool.query('UPDATE personas SET ? WHERE id = ?', [editPersona, id]);
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

router.get('/delete/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        await pool.query('DELETE FROM personas WHERE id = ?',[id]);
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});
export default router;