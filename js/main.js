window.onload = () => {
    GetData();
}

var LastId = 0;

function convertWorkType_Str2Num(str) {
    var work_num = 0;
    switch (str) {
        case "web":
            work_num = 0;
            break;
        case "book":
            work_num = 1;
            break;
        case "comic":
            work_num = 2;
            break;
        case "anime":
            work_num = 3;
            break;
        case "other":
            work_num = 4;
            break;
    }
    return work_num;
}

function convertWorkType_Num2Str(num) {
    var work_str = "";
    switch (num) {
        case "0":
            work_str = "Web小説";
            break;
        case "1":
            work_str = "書籍(小説)";
            break;
        case "2":
            work_str = "書籍(コミック)";
            break;
        case "3":
            work_str = "アニメ";
            break;
        case "4":
            work_str = "その他";
            break;
    }
    return work_str;
}

function createElement(json) {
    var parts = document.createElement('div');
    parts.className = "parts";
    var titleParts = document.createElement('p');
    titleParts.className = "titleParts";
    var titleItem = document.createElement('div');
    titleItem.innerHTML = "タイトル：";
    titleItem.className = "item";
    var title = document.createElement('div');
    title.innerHTML = json.title;
    title.className = "title";
    titleParts.appendChild(titleItem);
    titleParts.appendChild(title);
    var authorItem = document.createElement('div');
    authorItem.innerHTML = "作者：";
    authorItem.className = "item";
    var author = document.createElement('div');
    author.innerHTML = json.author;
    author.className = "author";
    var workTypeItem = document.createElement('div');
    workTypeItem.innerHTML = "作品の種類：";
    workTypeItem.className = "item";
    var workType = document.createElement('div');
    workType.innerHTML = convertWorkType_Num2Str(json.workType);
    workType.className = "workType";
    var p1 = document.createElement('p');
    p1.appendChild(authorItem);
    p1.appendChild(author);
    p1.appendChild(workTypeItem);
    p1.appendChild(workType);
    
    var remarksParts = document.createElement('p');
    var remarks_str = json.remarks;
    if (!json.remarks) {
        remarks_str = "特になし";
    }
    var remarksItem = document.createElement('div');
    remarksItem.innerHTML = "備考：";
    remarksItem.className = "item";
    var remarks = document.createElement('div');
    remarks.className = "remarks";
    remarks.innerHTML = remarks_str;
    remarksParts.appendChild(remarksItem);
    remarksParts.appendChild(remarks);

    parts.appendChild(titleParts);
    parts.appendChild(p1);
    parts.appendChild(remarksParts);
    parts.appendChild(document.createElement('hr'));

    document.getElementById('main').appendChild(parts);
}

function clearItem(){
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("workType").selectedIndex = 2;
    document.getElementById("remarks").value = "";
}

function PostData() {
    var title = document.getElementById("title").value;
    if (!title) {
        alert('タイトルを入力して下さい');
        return;
    }
    var titleClasses = document.getElementsByClassName('title');
    for(var i=0; i < titleClasses.length; i++) {
        if(title == titleClasses[i].innerHTML){
            alert('既に登録されている作品です');
            return;
        }
    }
    
    var author = document.getElementById("author").value;
    var type = convertWorkType_Str2Num(document.getElementById("workType").value);
    var remarks = document.getElementById("remarks").value;
    var json = { id: (LastId + 1), title: title, author: author, workType: type, remarks: remarks, url: null };
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            //console.log(xhr.response);
            createElement(json);
            alert('リクエストありがとうございます！');
            clearItem();
        }
    }
    xhr.open('POST', 'add_data.php');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(json));
}

function GetData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'get_data.php', true);
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = () => {
        //console.log(xhr.response);
        xhr.response.forEach(function (json) {
            createElement(json);
            var id = Number(json.id)
            if (id > LastId) {
                LastId = id;
            }
        });
    }
}