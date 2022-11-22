# DMSS OPENTEXT SS CONNECTOR
 CS 22.X+ OT SignBox CONNECTOR

1. Adds new menu item to action toolbar with name 'Sign Document'.
2. Menu element is active only when such conditions are met:

   2.1. Selected object mime type is "application/vnd.etsi.asic-e+zip"
   
   2.2. Selected object mime type is "application/pdf"

   2.3. Constant ALLOWED_MIMETYPES is defining allowed mime types (info.config.json).

3. After button 'Sign Document' is pressed user should be redirect to SignBox alternative view portal (access details are defined in info.config.json).
