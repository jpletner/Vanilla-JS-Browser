var addSkillButton = document.querySelector('.add-skill')
var skillTemplate = document.querySelector('.skill').cloneNode(true)
var removeSkillButton = document.querySelector('.remove-skill')
var form = document.querySelector('form')
var apiURL = '//sandiegojs-vanilla-workshop.herokuapp.com'
var submitHandler = function(evt) {
  evt.preventDefault()
  var path = apiURL + '/forms'
  xhr('POST', path, serializeArray('form'), function(err, data) {
    if (err) {throw err }
    console.log(data)
  })
}

var createElementWithTextNode = function(tagName, tagContent) {
  var node = document.createElement(tagName)
  var textNode = document.createTextNode(tagContent)
}

var xhr = function(method, path, data, callback) {
  var request = new XMLHttpRequest()
  request.open(method, path, true)
  request.setRequestHeader('Content-Type', 'application/json')
  request.onreadystatechange = function() {
    // ignore anything that isn't the last state
    if (request.readyState !== 4) { return }

    // if we didn't get a "good" status such as 200 OK or 201 Created send back an error
    if (request.readyState === 4 && (request.status !== 200 && request.status !== 201)) {
      callback(new Error('XHR Failed: ' + path), null)
    }

    // return our server data
    callback(null, JSON.parse(request.responseText))
  }
  request.send(JSON.stringify(data))
}

var serializeArray = function(selector) {
  var form = document.querySelector(selector)
  var formInputs = form.querySelectorAll('input:not([type=submit]),textarea')

  // Empty object for us to set key values of inputs
  var data = {}

  for (var i = 0; i < formInputs.length; i++) {
    var item = formInputs[i]

    if(item.name === 'skills_attributes') {
      if (!!data[item.name]) {
        data[item.name].push({'description': item.value})
      } else {
      data[item.name] = [{'description': item.value}]
      }
    } else {
    data[item.name] = item.value
    }
  }

  var wrapper = {};
  wrapper[form.name] = data;

  return wrapper
}

form.addEventListener('submit', submitHandler)

function last(selector) {
  var all = document.querySelectorAll(selector)
  var length = all.length
  return all[length - 1]
}

function addSkillHandler(evt) {
  var prevSkill = last('.skill')
  var newSkill = skillTemplate.cloneNode(true)
  var submitNode = document.querySelector('.submit')
  var form = submitNode.parentNode

  prevSkill.querySelector('.add-skill').classList.add('hidden')
  prevSkill.querySelector('.remove-skill').classList.remove('hidden')

  newSkill.querySelector('.add-skill').addEventListener('click', addSkillHandler)
  newSkill.querySelector('.remove-skill').addEventListener('click', removeSkillHandler)

  form.insertBefore(newSkill, submitNode)
}
addSkillButton.addEventListener('click', addSkillHandler)

function removeSkillHandler(evt) {
  var skill = evt.currentTarget.parentNode
  skill.remove()
}
removeSkillButton.addEventListener('click', removeSkillHandler)
