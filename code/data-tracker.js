$(document).on('knack-page-render.any', function(event, page) {
  // Hide the entire "Repeat" checkbox and label
  $("label:contains('Repeat')").hide();

  // Rename confusing google maps link
  $('a[title="view in google maps"]').text('View on Google Maps');
  
  //  remove signs/markings tabs/filter except on landing page
  if (page.key != 'scene_808'&& page.key != 'scene_809'  ) {
    $('#view_2106').remove();
  }
    
});


$(document).on('knack-view-render.view_958', function(event, page) {
//  hide crumb trail at select locations  
  setTimeout(
  function() 
  {
    $('.kn-crumbtrail').remove();
    //do something special
  }, 1000);

});



$(document).on('knack-scene-render.scene_428', function(event, page) {
  // update iframe src from detail field
  var iframe_url = $("span:contains('apps/webappviewer')").text();
    $( "#csr_view" ).attr('src', iframe_url);
    
});


$(document).on('knack-scene-render.scene_501', function(event, page) {
    //  update iframe src from detail field
    var iframe_url = $("span:contains('apps/webappviewer')").text();
    $( "#csr_view" ).attr('src', iframe_url);
    
});


$(document).on('knack-view-render.view_1407', function(event, page) {
  //  default city/state for VZA enforcement
    $("#city").val("Austin");
    $("#state").val("TX");
});


function insertRecord(data, scene, view) {

  var url = 'https://api.knack.com/v1/pages/' + scene + '/views/' + view + '/records';
  
  var user = Knack.getUserToken();
  var app_id = Knack.application_id;
  
  $.ajax({
    url: url,
    type: 'POST',
    headers: {
      'Authorization': Knack.getUserToken(),
      'X-Knack-Application-Id': Knack.application_id,
      'X-Knack-REST-API-Key':'knack',
      'Content-Type': 'application/json'
  },
    data: JSON.stringify(data),
    success: function(response) {
      Knack.hideSpinner();
    },
    error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status);
        console.log(thrownError);
      }
  });
}




$(document).on('knack-form-submit.view_1440', function(event, view, record) {
  //  prepare "Dispatch Technican" activity to be added on work order create
  //  https://builder.knack.com/atd/amd#pages/scene_428/views/view_1440
    var tmc_activity = {};
    var tmc_issue_id = record.field_1235_raw[0].id;  //  tmc_issue connection field
    var wo_id = record.id;  // work order database id
    var creaded_by = 'do something to get user id....';
    tmc_activity['field_1668'] = [tmc_issue_id]; // tmc issue connetion
    tmc_activity['field_1755'] = [wo_id];  //  work order connection
    tmc_activity['field_1053'] = 'Dispatch Technician'; //  activity
    tmc_activity['field_1874'] = 'in_progress';  //  issue status snapshot
    tmc_activity['field_1056'] = [creaded_by]; // created by
    //  insert activity via form on same page
    console.log(tmc_activity)
    insertRecord(tmc_activity, 'scene_428', 'view_1437');
});


function changeFieldColor(field, color_map){
  var child_field = $(field).find('.kn-value');
  var value = child_field.text()
  if (color_map[value]) {
    $(child_field).css({'background-color' : color_map[value].background_color, 'color': color_map[value].color });
  }
}


var colorMapOne = {
   'NEED TO BE ISSUED' : { "background_color" : "#e41a1c", "color" : "#fff" },
   'ON HOLD': { "background_color" : "#aeaeae", "color" : "#fff" },
   'ISSUED': { "background_color" : "#377eb8", "color" : "#fff" },
   'NEEDS GIS': { "background_color" : "#984ea3", "color" : "#fff" },
   'FINAL REVIEW': { "background_color" : "#4daf4a", "color" : "#fff" }
}


$(document).on('knack-scene-render.any', function() {
  //  work orders signs/markings status
  changeFieldColor('.field_2181', colorMapOne);
  
  //  work orders signs/markings job status
  changeFieldColor('.field_2190', colorMapOne);
})



$(document).on('knack-view-render.view_2107', function(event, page) {
  //  replace attachment filename with attachment type
  //  find each attachment cell
   $('td.field_2405').each(function() {
       
     //  find each attachment link within the cell
      $(this).find('a').each(function( index ){

        var attachmentType = '';
      
        //  search the neighboring field (attachmenty type) and retrieve the corresponding type 
        $(this).closest('tr').children('td.field_2403').find('span').children('span').each(function( index2 ) {
              if (index == index2) {
                attachmentType = $(this).text();
              }
        });
        
        //  update link contents 
        $(this).html(attachmentType);

      });
  });
    
});

$(document).on('knack-view-render.view_2108', function(event, page) {
  //  replace attachment filename with attachment type
  //  find each attachment cell
   $('td.field_2405').each(function() {
       
     //  find each attachment link within the cell
      $(this).find('a').each(function( index ){

        var attachmentType = '';
      
        //  search the neighboring field (attachmenty type) and retrieve the corresponding type 
        $(this).closest('tr').children('td.field_2403').find('span').children('span').each(function( index2 ) {
              if (index == index2) {
                attachmentType = $(this).text();
              }
        });
        //  update link contents 
        $(this).html(attachmentType);

      });
  });
    
});


function modCrumbtrail() {
  //  function to replace crumbtrail contents on signs/markings work orders when technician is viewing
  // if user is a signs/markings tech

  var techUserRole = 'object_152';
  if ( Knack.getUserRoles(techUserRole) ) {
    $('div.kn-crumbtrail').find('a').each( function( index ) {
      var text = $(this).text().toUpperCase();

      //  replace crumb pointer from work orders to jobs
      if ( text.indexOf('WORK ORDERS') >= 0) {
        var href = this.href;
        href = href.replace('work-orders-markings', 'work-jobs-markings')
        this.href = href;
        $(this).text('Jobs');
      }

      // remove intermediary Markings or Signs work order landing page crumb entirely
      if ( text == 'MARKINGS') {
        $(this).remove();
        //  remove extra "→" span
        var span = $('div.kn-crumbtrail').find('span')[1];
        $(span).remove();

      } else if ( text == 'SIGNS') {
        $(this).remove();
        //  remove extra "→" span
        var span = $('div.kn-crumbtrail').find('span')[1];
      }
    });
  } 
}


$(document).on('knack-scene-render.scene_713', function(event, page) {
   modCrumbtrail();
});

//  remove default crumbtrail on signs/markings work orders when technician is viewing
$(document).on('knack-scene-render.scene_716', function(event, page) {
   modCrumbtrail();
});

//  remove default crumbtrail on signs/markings work orders when technician is viewing
$(document).on('knack-scene-render.scene_724', function(event, page) {
   modCrumbtrail();
});

//  remove default crumbtrail on signs/markings work orders when technician is viewing
$(document).on('knack-scene-render.scene_751', function(event, page) {
   modCrumbtrail();
});

//  remove default crumbtrail on signs/markings work orders when technician is viewing
$(document).on('knack-scene-render.scene_753', function(event, page) {
   modCrumbtrail();
});

//  remove default crumbtrail on signs/markings work orders when technician is viewing
$(document).on('knack-scene-render.scene_762', function(event, page) {
   modCrumbtrail();
});

//  remove default crumbtrail on signs/markings work orders when technician is viewing
$(document).on('knack-scene-render.scene_763', function(event, page) {
   modCrumbtrail();
});

//  remove default crumbtrail on signs/markings work orders when technician is viewing
$(document).on('knack-scene-render.scene_720', function(event, page) {
   modCrumbtrail();
});


//  replace 'Quantity' label with UOM of measure by parsing the select value contents
//  was unable to use the chosen.js native events because of however Knack has implemented them
//  so listening for click which is a bit wonky
function setUOM(element){
  //  expects a connection selector field with a pipe-delmited name/unit of measure
  var item = $(element).find("span").text()
  
  if (item.split('|')[1]) {
    var unitOfMeasure = item.split('|')[1].trim()
    $("#kn-input-field_2214").find('.kn-input-label').text(unitOfMeasure);
  }
}

$(document).on('knack-scene-render.scene_716', function(event, page) {
  //  handle a click
  $("#view_1929_field_2220_chzn").click( function(){
    setUOM(this);
  });

  //  and for good measure update UOM on field focus
  $('#field_2214').focus(function() {
    var element = $("#view_1929_field_2220_chzn")['0']
    setUOM( element );
  })

});


function setRequester() {
  //  function to set a requester field by an attribute value associated with the logged-in user

  var divisionField = 'field_2186';

  var requesterSelectorId = '#view_1880-field_2162';

  if ( !Knack.getUserRoles('object_151') ) { //  ignore if user is supervisor role
    var userAttrs = Knack.getUserAttributes();
    var division = userAttrs.values[divisionField];
    $(requesterSelectorId).val(division).change();
    $(requesterSelectorId).prop('disabled', 'true');
  }
  
}


$(document).on('knack-view-render.view_1880', function(event, page) {
  setRequester();
});

$(document).on('knack-scene-render.scene_713', function(event, page) {
  // remove "signs" dropdown from workgroup selection choices based when work order type is markings
  var workType = $('.field_2292 .kn-value').text().toUpperCase();

  if (workType == 'MARKINGS') {
    
    $("#view_1887-field_2173 option[value='SIGNS']").remove();

  }

});


$(document).on('knack-scene-render.scene_1', function(event, page) {
  // redirect to embedded homepage from unembedded homepage login
  var url = window.location.href;

  if (url.indexOf('knack.com') >= 0) {
    
    // window.location.replace('http://transportation.austintexas.io/data-tracker');

  }
});


// remove empty "select..." choices from advanced signal search
$(document).on('knack-view-render.view_1169', function(event, page) {
  // id*="_moComments_"
  // $("#kn_filter_7_field_1513_chzn_c_0").remove();
  // $("#kn_filter_8_field_491_chzn_c_0").remove();
  // $("#kn_filter_4_field_2437_chzn_c_0").remove();

});


//////////////////////////////////////////////////
// Remove whitespace from street segment inputs///
//////////////////////////////////////////////////
$(document).on('knack-view-render.view_1199', function(event, scene) {
    $( "#field_119" ).keyup(function() {
        var trimmed = $( "#field_119" ).val().trim();
        $( "#field_119" ).val(trimmed);
    });
});

$(document).on('knack-view-render.view_1200', function(event, scene) {
    $( "#field_119" ).keyup(function() {
        var trimmed = $( "#field_119" ).val().trim();
        $( "#field_119" ).val(trimmed);
    });
});

$(document).on('knack-view-render.view_1207', function(event, scene) {
    $( "#field_119" ).keyup(function() {
        var trimmed = $( "#field_119" ).val().trim();
        $( "#field_119" ).val(trimmed);
    });
});

$(document).on('knack-view-render.view_1206', function(event, scene) {
    $( "#field_119" ).keyup(function() {
        var trimmed = $( "#field_119" ).val().trim();
        $( "#field_119" ).val(trimmed);
    });
});

$(document).on('knack-view-render.view_1996', function(event, scene) {
    $( "#field_119" ).keyup(function() {
        var trimmed = $( "#field_119" ).val().trim();
        $( "#field_119" ).val(trimmed);
    });
});

//////////////////////////////////////////////////
//////////////////////////////////////////////////
