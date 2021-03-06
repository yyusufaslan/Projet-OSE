	(function($) {
		
		var BookJS = {};
		window.BookJS = BookJS;
	
	
	
		var hashTemplate = {'contact':window.contactTemplate,'contactList':window.contactListTemplate,
		 'contactEdit':window.contactEditTemplate, 'contactAdd':window.contactAddTemplate};
	
		var template = function(name) {
			return Mustache.compile(hashTemplate[name]);
		};
	
	
		BookJS.Contact = Backbone.Model.extend({
	
	
	
			defaults : {
	
				prenom:"j'ai pas de nom",
				nom:"j'ai pas de prenom",
				numero:"911",
				validate:true
			},
	
			initialize : function() {
				console.log('Contact Constructor');
				this.on("invalid", function(model, error){
					console.log( error );
				});
	
	
			},
	
			setPrenom : function(value){
				this.set({prenom:value});
			},
	
			setNom : function(value){
				this.set({nom:value});
			},
	
			validate : function(attributes){
				if(attributes.prenom ==='' ||attributes.nom === ''){
					return "Le nom et le prenom ne peuvent �tre vides";
				}
			}
	
	
	
	
	
		});
	
	
	
		BookJS.Book = Backbone.Collection.extend({
			model : BookJS.Contact,
			//localStorage: new Store("book"),
	
	
			initialize : function(){
				this.url = 'http://localhost:8080/jaxrs-contact/contacts/getAll';
				console.log('Book constructor');
	}
	
	
	
	});
	
		BookJS.collection = new BookJS.Book();
	
	
	
	
	
		BookJS.BookView = Backbone.View.extend({
			template : template('contactList'),
	
	
			initialize : function() {
				console.log("BookView constructor");
	
	
	
				BookJS.collection.on('all', this.render, this);
				//BookJS.collection.fetch();
	
			},
	
			render : function() {
	
	
	
	
				var renderedContent = this.template(); 
	
	
	
				$(this.el).html(renderedContent);
				BookJS.collection.each(this.addContact, this);
	
				addForm = new BookJS.AddForm({collection:BookJS.collection});
				$(this.el).append(addForm.render().el);
				return this;
			},
	
			addContact:function(contact){
	
				contactView =new BookJS.contactView({model:contact});
	
				$(this.el).find('#contactsContainer').append(contactView.render().el);
			}
	
	
		});
	
		BookJS.contactView = Backbone.View.extend({
			template : template('contact'),
	
			events :{
				'click .img':'update'
			},
	
	
	
			render:function(){
				window.templateVisible = this.template;
	
	
				renderedContent = this.template(this.model.toJSON());
				$(this.el).html(renderedContent);
				return this;
			},
	
			update:function(){
				BookJS.router.navigate('#editContact/'+this.model.id, {trigger:true});
			}
	
	
	
	
		});
	
	
		BookJS.editView = Backbone.View.extend({
			template : template('contactEdit'),
			contactID:0,
	
			events:{
				'click button#deleteContact' : 'removeContact',
				'click button#validEditContact' : 'validateEdit'
			},
	
	
			initialize : function() {
				console.log("BookView constructor");
	
				
			},
	
	
	
			render : function() {
	
	
				var renderedContent = this.template(BookJS.collection.get(this.contactID)); 
				
				$(this.el).html(renderedContent);
				return this;
			},
	
	
			removeContact:function(){
			//BookJS.collection.get(this.contactID).destroy();
			BookJS.collection.remove(this.contactID);
			BookJS.router.navigate('/',{trigger:true});
		},
	
		validateEdit:function(){
			BookJS.collection.get(this.contactID).set({nom: $('#nom').val(),prenom:$('#prenom').val(),numero:$('#numero').val()});
			console.log(BookJS.collection.get(this.contactID));
			BookJS.router.navigate('/', {trigger:true, replace:true});
		}
	
	
	});
	
	
		BookJS.AddForm = Backbone.View.extend({
			template: template('contactAdd'),
			contact:{},
	
			events: {
				'click button#validAddContact': 'add'
			},
			render: function() {
				$(this.el).html(this.template);
				return this;
			},
			add: function(event) {
				event.preventDefault();
	
				this.contact = new BookJS.Contact({nom: $('#nom').val(),prenom:$('#prenom').val(),numero:$('#numero').val()});
	
				BookJS.collection.add(this.contact);
				BookJS.collection.sync();
	
	
				this.render();
	
			}
	
			
	
	
		});
	
	
	
	
	
	
	
	BookRouter = Backbone.Router.extend({
		initialize: function(options) {
			this.el = options.el
		},
		routes: {
			"editContact/:id" : "edit",
			"*path": "index",
	
	
		},
		index: function(path) {
			var index = new BookJS.BookView();
			this.el.empty();
			this.el.append(index.render().el);
		},
	
		edit:function(id){
			this.el.empty();
			editView = new BookJS.editView();
			editView.contactID=id;
			this.el.append(editView.render().el);
		}
	});
	
	BookJS.boot = function(container){
		container = $(container);
		BookJS.router = new BookRouter({el:container});    
		Backbone.history.start({replace:true});	
	
	}
	
	
	
	})(Zepto);