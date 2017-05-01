var isAuthenticated = require("../config/middleware/isAuthenticated");


var db = require("../models");
var express = require('express');
var router  = express.Router();
var mysql = require('mysql')
// var connection = require('../config/connection.js')

router.get('/home', function(req,res){

    db.User.findOne({
        where: {
      id: 4,
    },
    include: [db.Job]
      }).then(function(result) {
        console.log(result.toJSON())
    var hbs_obj = result.toJSON()
    // var possible_section_names = []
    // // loop over all credentials 
    // for (c in result.Credentials){
    //     // reformat as json
    //     cred = result.Credentials[c].toJSON()
    //     // check whether the section_name is already registered 
    //     if (possible_section_names.indexOf(cred.section_name) < 0){
    //         // if not, add it to the list of section_names 
    //         possible_section_names.push(cred.section_name)
    //         // then add the whole credential to the handlebars obj
    //         var cred_obj = {section_name: cred.section_name,
    //                         creds: [cred]} 
    //         hbs_obj.section_creds.push(cred_obj)
    //     }
    //     else{
    //         for (s in hbs_obj.section_creds){
    //             if (hbs_obj.section_creds[s].section_name == cred.section_name){
    //                 var current_section = hbs_obj.section_creds[s]
    //                 current_section.creds.push(cred)
    //         }
    //         }
        
    // }}
    // console.log(result)
    // // for (i in hbs_obj.section_creds){
    // //  console.log(hbs_obj.section_creds[i].creds)}
    res.render("Employer/home", hbs_obj)
  
    });
    
});

router.get('/applicant/:user_name', function(req,res){

	db.User.findOne({
		where: {
      name: req.params.user_name,
    },
    include: [db.Credential]
      }).then(function(result) {
    var hbs_obj = {data: result,
    			  section_creds: []}
    var possible_section_names = []
    // loop over all credentials 
    for (c in result.Credentials){
    	// reformat as json
    	cred = result.Credentials[c].toJSON()
    	// check whether the section_name is already registered 
    	if (possible_section_names.indexOf(cred.section_name) < 0){
    		// if not, add it to the list of section_names 
    		possible_section_names.push(cred.section_name)
    		// then add the whole credential to the handlebars obj
    		var cred_obj = {section_name: cred.section_name,
    						creds: [cred]} 
    		hbs_obj.section_creds.push(cred_obj)
    	}
    	else{
    		for (s in hbs_obj.section_creds){
    			if (hbs_obj.section_creds[s].section_name == cred.section_name){
					var current_section = hbs_obj.section_creds[s]
					current_section.creds.push(cred)
    		}
			}
    	
    }}
    console.log(result)
    // for (i in hbs_obj.section_creds){
    // 	console.log(hbs_obj.section_creds[i].creds)}
    res.render("Employer/applicant-profile", hbs_obj)
  
    });
	
});

module.exports = router;