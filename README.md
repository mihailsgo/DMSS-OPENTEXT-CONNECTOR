# DMSS OPENTEXT SS CONNECTOR
 CS 22.X+ OT SignBox CONNECTOR

1. Adds new menu item to action toolbar with name 'Sign Document'.
2. Menu element is active only when such conditions are met:

   2.1. Only one object is selected.

   2.2. Selected object mime type is "application/vnd.etsi.asic-e+zip"
   
   2.3. Selected object mime type is "application/pdf"

   2.4. INFO: Constant ALLOWED_MIMETYPES is defining allowed mime types (info.config.json).

3. After button 'Sign Document' is pressed user should be redirect to SignBox alternative view portal (access details are defined in info.config.json).

TODO:

1. Develope scenario with container creation.
2. Define if middle-view interface is needed for such cases.
