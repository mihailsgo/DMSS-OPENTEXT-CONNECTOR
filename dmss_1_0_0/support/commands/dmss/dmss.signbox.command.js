csui.define(['csui/utils/commands/open.classic.page', 'json!dmss/config/info.config.json', 'csui/utils/contexts/factories/connector', 'csui/lib/backbone', 'csui/utils/commandhelper'
], function (OpenClassicPageCommand, settings, ConnectorFactory, Backbone, CommandHelper) {
  'use strict';

  var redirectURI = function(session, docid){
    let sessionString = "?session=" + session;
    let docidString = "&docId=" + docid;
    let redirectURIString = "&redirectUrl=" + window.location.href;
    let url = settings.EXT_PORTAL_HOST_URL + "/extportal/alternative/document";
    
    url = url + sessionString + docidString + redirectURIString;

    return url;
  }

  var OpenClassicCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'AddCompDoc',
      scope: 'single'
    },

    getUrlQueryParameters: function (node, options) {      
    },

    execute: function (nodeList, options){
	        let connector = options.context.getObject(ConnectorFactory);
		    let endpoint = settings.GATEWAY_TICKET_API;
            let ticket = connector.connection.session.ticket;
		    let nodes = CommandHelper.getAtLeastOneNode(nodeList);
            let selectedDocumentID = nodes.models[0].attributes.id;
			
			Backbone.ajax({
			  type: "POST",
			  cache: false,
			  url: endpoint,
			  headers: { 'OTCSTICKET': ticket},
			  success: function(data){		
				window.location.href = redirectURI(data.session, selectedDocumentID);
			  },
			  error: function(error){
				alert(error);
			  }
			})         
    }
	
  });
	
  return OpenClassicCommand;

});
