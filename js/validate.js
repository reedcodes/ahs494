$(document).ready(function() {
   var $required = $('form').find('[required], [aria-required]');
   var $form = $required.closest('form');
   var $fields = $form.find('input, textarea, select').not('[type=submit]');

   $form.on('submit', function(e) { // needed if HTML5 validation is not supported
      var bErr = false;

      // check all required fields
      $required.each(function(index) {
         bErr = !isValid($(this));
      });

      if (bErr) {
         $required.filter('[aria-invalid=true]').first().focus(); // set focus on first invalid field
         e.preventDefault(); // prevent the form from submiting
         return false;
      }
   });

   $required.on('invalid', function(e) { // Hook the HTML5 validation
       return !isValid($(this)); // validate the field
   });

});

function validateField(e) {
    e = e || window.event;
    var target = e.target|| e.srcElement;
    var $field = $(target);

    if (e.keyCode == '9') { // ignore tab key
       return true;
    }

    if (typeof $field[0].checkValidity == 'function') {
       $field[0].checkValidity();
    }

    isValid($field);
    return true;
}
function isValid($field) {
   var value = $field.val();
   var errID = $field.attr('id') + '-err';
   var $errContainer = $('#' + errID);
   var func = null;
   var msg = $field.attr('data-errmsg');

   switch($field.attr('type')) {
      case 'text': {
         var func = isValidLength;
         break;
      }
      case 'email': {
         var func = isValidEmail;
         break;
      }
      case 'tel': {
         var func = isValidTelephone;
         break;
      }
      default: {
         if (!$field.prop('tagName').toLowerCase() == 'textarea') {
            return true;
         }
         var func = isValidLength;
      }
   }

   if (!func($field)) {
      if ($field.attr('aria-invalid') == 'true') {
         // do nothing if the field was already invalid
         return false;
      }

      // field is invalid
      $errContainer.html('<p id="' + errID + '-msg"><span class="fas fa-exclamation-triangle" aria-hidden="true" role="presentation"></span> ' + msg + '</p>');
      $field.attr({
         'aria-invalid': 'true',
         'aria-describedby': errID + '-msg'
      });

      return false;

   }
   else {
      $field.removeAttr('aria-describedby')
         .attr('aria-invalid', 'false');
      $errContainer.empty();
      return true;
   }
}

function isValidLength($field) { // check that there is data in the field
   var value = $field.val();
   if (value.length == 0) {
      return false;

   }
   return true;
}

function isValidEmail($field) { // check that email is valid

   var value = $field.val();

   if ((value.length == 0) || (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value) == false)) {
      return false;
   }
   return true;
}
function isValidTelephone($field) { // check that telephone is valid

   var value = $field.val();

   if ((value.length == 0) || (/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value) == false)) {
      return false;
   }
   return true;
}
