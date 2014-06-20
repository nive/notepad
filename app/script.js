
/* Nive Notepad - Scripts 
 * 
 * Communicates with DataStorage (notes) and UserAccount component in the domain.
 *  
 * Based on nive-jquery plugins. Requires the following files:
 *  <script src="http://assets.nive.io/assets/nive/endpoint-0.6.js"></script>
 *  <script src="http://assets.nive.io/assets/nive/jq-datastorage-0.6.js"></script>
 *  <script src="http://assets.nive.io/assets/nive/jq-user-0.6.js"></script>
 */
  

/* Notepad entry point
 * 
 * Shows the user options based on the current users' state (authenticated or not).
 */
$(document).ready(function(){
    nive.User().authenticated()
        .done(function (data, message, xhr) {
            // success: text has been stored
            if(data.result) {
                $('.nouser').hide();
                $('.auth').show();
                $('#notes').show();
                loadnotes(); 
            }
            else {
                $('.nouser').show();
                $('.auth').hide();
                $('#notes').hide();
                $('#message span').html('Please sign in!');
                $('#message').show('fast');
            }
        });
});

    
/* DataStorage Functions  
 *
 * The DatasTorage jquery plugin is based on jQuery's 'ajax()' method. Async callbacks 
 * and error handling uses the same syntax and options like 'ajax()' calls. 
 */

/* Loads a number of notes from the server and renders the result. The actual number to be loaded 
  is passed in as 'count'. */
function loadnotes(count) {
    $('#message').hide();
    count = count || 100;
    // creates a nive DataStorage object and calls 'list()' to retrieve the notes from
    // the server. 
    var storage = new nive.DataStorage({name:'notes'});
    storage.list({key:'note', sort:'timestamp', order:'>', size:count})
        .done(function (data, message, xhr) {
            // success: notes received
            var notes = data.items;
            var blocks = "";
            for(i=0;i<notes.length;i++) {
                var html = note_tmpl;
                var newDate = new Date();
                newDate.setTime(notes[i].timestamp*1000);
                ts = newDate.toLocaleString();
                html = html.replace("-id-", notes[i].id);
                html = html.replace("-id-", notes[i].id);
                html = html.replace("-id-", notes[i].id);
                html = html.replace("-text-", notes[i].value);
                html = html.replace("-date-", ts);
                blocks += html;
            }
            $('#notecontainer').after(blocks);
        })
        .fail(function (jqXHR, message, error) {
            // error: something went wrong
            if(jqXHR.status=='403') {
                $('#message span').html('Please sign in!');
                $('#message').show('fast');
            } else {
                $('#message span').html('Sorry! ' + error + '. ' + jqXHR.responseJSON.error);
                $('#message').show('fast');
            }
        });
}

/* Adds a new note and stores it on the server. */
function addnote() {
    $('#message').hide();
    var text = $('#newtext').val();
    if(!text)  return;
    // stores a new note based on the entries in the first note block.
    nive.DataStorage({name:'notes'}).newItem({key:'note', value:text})
        .done(function (data, message, xhr) {
            // success: text has been stored
            number_stored = data.result;
            $('#newtext').val('');
            $('#message span').html('Note stored!');
            $('#message').show('fast');
            loadnotes(1);
        })
        .fail(function (jqXHR, message, error) {
            // error: something went wrong
            if(jqXHR.status=='403') {
                $('#message span').html('Please sign in!');
                $('#message').show('fast');
            } else {
                $('#message span').html('Sorry! ' + error + '. ' + jqXHR.responseJSON.error);
                $('#message').show('fast');
            }
        });
}

function updatenote(textid) {
    $('#message').hide();
    var text = $('#note'+textid+' div.note').html();
    if(!text)  return;
    // updates the text of the selected note
    nive.DataStorage({name:'notes'}).setItem({key:'note', id:textid, value:text})
        .done(function (data, message, xhr) {
            // success: text has been stored
            $('#message span').html('Note saved!');
            $('#message').show('fast');
        })
        .fail(function (jqXHR, message, error) {
            // error: something went wrong
            if(jqXHR.status=='403') {
                $('#message span').html('Please sign in!');
                $('#message').show('fast');
            } else {
                $('#message span').html('Sorry! ' + error + '. ' + jqXHR.responseJSON.error);
                $('#message').show('fast');
            }
        });
}

function deletenote(textid) {
    $('#message').hide();
    if(!textid)  return;
    // deletes the selected note
    nive.DataStorage({name:'notes'}).deleteItem({key:'note', id:textid})
        .done(function (data, message, xhr) {
            // success: text has been deleted
            number_deleted = data.result;
            if(number_deleted) {
                $('#note'+textid).remove();
                $('#message span').html('Text deleted!');
                $('#message').show('fast');
            } else {
                $('#message span').html('Not allowed!');
                $('#message').show('fast');
            }
        })
        .fail(function (jqXHR, message, error) {
            // error: something went wrong
            if(jqXHR.status=='403') {
                $('#message span').html('Please sign in!');
                $('#message').show('fast');
            } else {
                $('#message span').html('Sorry! ' + error + '. ' + jqXHR.responseJSON.error);
                $('#message').show('fast');
            }
        });
}

/* The template used to render notes. Based on a simple search&replace syntax. */
var note_tmpl = ' \
    <div class="col-md-4" id="note-id-"> \
      <div class="panel panel-default"> \
        <div contenteditable="true" class="panel-body note">-text-</div> \
        <div class="panel-footer"> \
          <p class="pull-right"> \
            <a href="#" onclick="updatenote(\'-id-\')">[- save]</a> \
            <a href="#" onclick="deletenote(\'-id-\')">[- remove]</a> \
          </p> \
          <p>-date-</p> \
        </div> \
      </div> \
    </div> \
';


/* UserAccount Functions  
 * 
 * The User Account connection is based on the widgets provided by the component. The widgets
 * are pre rendered html forms and fetched from the server and displayed in the '#userforms'
 * blocks. Form actions are actually triggered as ajax calls.  */
    
function loadsignin() {
    var url = nive.endpoint.widgetUrl({method:'signin',name:'users'});
    $('#userforms').load(url, {label:false, redirect:document.location.origin+document.location.pathname, ajax:false});
}

function loadsignup() {
    var url = nive.endpoint.widgetUrl({method:'signup',name:'users'});
    $('#userforms').load(url, {label:false, ajax:false});
}

function loadresetpw() {
    var url = nive.endpoint.widgetUrl({method:'resetPassword',name:'users'});
    $('#userforms').load(url, {label:false, ajax:false});
}

function loadupdate() {
    var url = nive.endpoint.widgetUrl({method:'update',name:'users'});
    $('#userforms').load(url, {});
}

function loadupdatepw() {
    var url = nive.endpoint.widgetUrl({method:'updatePassword',name:'users'});
    $('#userforms').load(url, {label:false, ajax:false});
}

// Unlike the previous calls signout does not use a widget but calls the js api
// function directly
function signout() {
    nive.User().signout()
        .done(function (data, message, xhr) { 
            document.location.href=document.location.origin+document.location.pathname; 
        });
}

