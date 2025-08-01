// Use TextDecoder to decode command results.
const dec = new TextDecoder();

// Google OAuth2 Client secret
const CLIENT_ID = '366480295546-prb86tp0a3oc3ec0nijjrq0s44slh2te.apps.googleusercontent.com';
const API_KEY = 'AIzaSyB4E46Snvv1nEZro_Ju_AXpnEcC6AAJ7_0';

// Discovery doc
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

// All the communication are done in appDataFolder
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';

let tokenClient;
let gapiInited = false;
let gisInited = false;

addEventListener('load',()=>{
 document.getElementById('authorize_button').style.visibility = 'hidden';
 document.getElementById('signout_button').style.visibility = 'hidden';
});

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
 gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
 await gapi.client.init({
  apiKey: API_KEY,
  discoveryDocs: [DISCOVERY_DOC],
 });
 gapiInited = true;
 maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
 tokenClient = google.accounts.oauth2.initTokenClient({
  client_id: CLIENT_ID,
  scope: SCOPES,
  callback: '', // defined later
 });
 gisInited = true;
 maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
 if (gapiInited && gisInited) {
  document.getElementById('authorize_button').style.visibility = 'visible';
 }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
 tokenClient.callback = async (resp) => {
  if (resp.error !== undefined) {
   throw (resp);
  }
  document.getElementById('signout_button').style.visibility = 'visible';
  document.getElementById('trmwin').style.visibility = 'visible';
  document.getElementById('authorize_button').innerText = 'Refresh';
  await listFiles();
 };

 if (gapi.client.getToken() === null) {
  // Prompt the user to select a Google Account and ask for consent to share their data
  // when establishing a new session.
  tokenClient.requestAccessToken({prompt: 'consent'});
 } else {
  // Skip display of account chooser and consent dialog for an existing session.
  tokenClient.requestAccessToken({prompt: ''});
 }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
 const token = gapi.client.getToken();
 if (token !== null) {
  google.accounts.oauth2.revoke(token.access_token);
  gapi.client.setToken('');
  document.getElementById('content').innerText = '';
  document.getElementById('authorize_button').innerText = 'Authorize';
  document.getElementById('signout_button').style.visibility = 'hidden';
 }
}

/**
 * List all files
 */
async function listFiles(pageToken) {
 if(!pageToken) pageToken="";
 
 let res;
 try {
  res = await gapi.client.drive.files.list({
   pageToken,
   'spaces': 'appDataFolder',
   'pageSize': 10,
   'fields': 'nextPageToken, files(id, name)',
  });
 } catch (err) {
  document.getElementById('content').innerText = err.message;
  return [];
 }
 const files = res.result.files;
 if(res.result.nextPageToken){
  files.push(... await listFiles(res.result.nextPageToken));
 }
 
 if (!files || files.length == 0) return [];
 return files;
}

async function createBinFile(name,data) {
 
}

async function createTextFile(name,data) {
 return new Promise(resolv=>{
  let boundary = "-------314159265358979323846";
  while(data.includes(boundary)){
   boundary = '-------31415926535'+(Math.floor(Math.random()*10000000000)+"0000000000").slice(-10);
  }
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  const contentType = 'application/x-shellscript';

  var metadata = {
   'name': name,
   'parents': ["appDataFolder"],
   'mimeType': contentType
  };

  var multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: ' + contentType + '\r\n\r\n' +
      data +
      close_delim;

  var request = gapi.client.request({
   'path': '/upload/drive/v3/files',
   'method': 'POST',
   'params': {'uploadType': 'multipart'},
   'headers': {
    'Content-Type': 'multipart/related; boundary="' + boundary + '"'
   },
   'body': multipartRequestBody});
  
  request.execute(resolv);
 });
}

async function getFile(fileId) {
 const file = await gapi.client.drive.files.get(
  {fileId, mimeType:"application/octet", alt: 'media'},
  {responseType: 'arraybuffer'}
 );
 const charArray = new Array(file.body.length);
 for(let i=0;i<file.body.length;i++){
  charArray[i]=file.body.charCodeAt(i);
 }
 return new Uint8Array(charArray);
}

async function delFile(fileId){
 return (await gapi.client.drive.files.delete({fileId}));
}

/**
 * wait for fname; set fname "" to check only once
 * return Promise<{"name":id}>
 */
async function waitFor(fname){
 let list = [];
 let ids = {};
 let found = (fname=="");
 do{
  ids= {};
  await new Promise(rslv=>setTimeout(rslv,1500));
  try{
   list = await listFiles();
   for(let i=0;i<list.length;i++){
    found = found || (list[i].name==fname);
    if(list[i].name in ids){
     await delFile(list[i].id);
     console.log(`deleted ${list[i].name}`);
    }
    else ids[list[i].name] = list[i].id;
   }
  }catch(err){
   console.log('Failed to generate file id list:'+err.toString());
  }
 }while(!found);
 return ids;
}

async function send(cmd){
 let ids = await waitFor("");
 if("cmd.msg" in ids) await delFile(ids["cmd.msg"]);
 if("cmd.dat" in ids) await delFile(ids["cmd.dat"]);
 if("resp.msg" in ids) await delFile(ids["resp.msg"]);
 if("resp.dat" in ids) await delFile(ids["resp.dat"]);
 
 if(cmd.startsWith("put ")){
  /// For data upload ..... incomplete script
 }
 try{
  await createTextFile("cmd.msg",cmd);
 }catch {return "error sending cmd";}

 ids = await waitFor('resp.msg');

 if("resp.dat" in ids){
  const res = await getFile(ids["resp.dat"]);
  const blob = new Blob([res],
                        {type:"application/octet"});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.click();
 }

 const respMsg = dec.decode(await getFile(ids["resp.msg"]));
 return respMsg;
}
