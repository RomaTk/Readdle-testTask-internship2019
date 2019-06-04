//position in array to add image
function fromWhichInputWasEvent(thisInput,inputs){
	let toAddPosition=0;
	for(let i=0;i<inputs.length;i+=1){
		if(inputs[i]==thisInput){
			toAddPosition=i;
		}
	}
	return toAddPosition
}
//locate images in horizontal mode
function sizeImagesHorizontal(imageArray,canvas){
	let maxHeightOfImage=0;
	for(let i=0; i<imageArray.length;i+=1){
		if (imageArray[i]!=null){
			if(maxHeightOfImage<imageArray[i].naturalHeight){
				maxHeightOfImage=imageArray[i].naturalHeight;
			}
		}
	}
	let newXlocation=0;
	for(let i=0; i<imageArray.length;i+=1){
		if (imageArray[i]!=null){
			let img=imageArray[i];
			let width=maxHeightOfImage/img.naturalHeight*img.naturalWidth;
			howDrawImage(canvas,img,newXlocation,0,width,maxHeightOfImage);
			newXlocation=width+newXlocation;
		}
	}
}
//
//locate images in vertical mode
function sizeImagesVertical(imageArray,canvas){
	let maxWidthOfImage=0;
	for(let i=0; i<imageArray.length;i+=1){
		if (imageArray[i]!=null){
			if(maxWidthOfImage<imageArray[i].naturalWidth){
				maxWidthOfImage=imageArray[i].naturalWidth;
			}
		}
	}
	let newYlocation=0;
	for(let i=0; i<imageArray.length;i+=1){
		if (imageArray[i]!=null){
			let img=imageArray[i];
			let height=maxWidthOfImage/img.naturalWidth*img.naturalHeight;
			howDrawImage(canvas,img,0,newYlocation,maxWidthOfImage,height);
			newYlocation=height+newYlocation;
		}
	}
}
// create sized canvas 
function makeSizedCanvasForImages(imageArray,canvas){
	let calculatedHeightForCanvas=0;
	let calculatedWidthForCanvas=0;
	for(let i=0; i<imageArray.length;i+=1){
		if(imageArray[i]!=null){
			let img=imageArray[i];
			for(let i=0;i<img.toDrawIn.length;i+=1){
				if(img.toDrawIn[i][0]==canvas){
					let toHeight=img.toDrawIn[i][2]+img.toDrawIn[i][4];
					if (toHeight>calculatedHeightForCanvas){
						calculatedHeightForCanvas=toHeight;
					}
					let toWidth=img.toDrawIn[i][1]+img.toDrawIn[i][3];
					if (toWidth>calculatedWidthForCanvas){
						calculatedWidthForCanvas=toWidth;
					}
				}
			}
		}
	}
	canvas.height=calculatedHeightForCanvas;
	canvas.width=calculatedWidthForCanvas;
}
//to rewrite canvas
function putInCanvasImages(imageArray,canvas){
	for(let i=0; i<imageArray.length;i+=1){
		if(imageArray[i]!=null){
			let img=imageArray[i];
			drawImage(img);
		}
	}
}
//add place to draw
function howDrawImage(canvas,img,posx,posy,width,height){
	if ((img.toDrawIn==undefined)||(img.toDrawIn==null)){
		img.toDrawIn=[[canvas,posx,posy,width,height]];
	}else{
		img.toDrawIn.push([canvas,posx,posy,width,height]);
	}
}
//draw image
function drawImage(img){
	let imageObject=img;
	for(let i=0; i<imageObject.toDrawIn.length;i+=1){
		let propertiesToDraw=imageObject.toDrawIn;
		propertiesToDraw[i][0].getContext('2d').drawImage(imageObject,propertiesToDraw[i][1],propertiesToDraw[i][2],propertiesToDraw[i][3],propertiesToDraw[i][4]);
	}
	imageObject.toDrawIn=undefined;
}
//create image 
function createImage(file){
	let reader = new FileReader();
	reader.readAsDataURL(file);
	let img = new Image();
	reader.onload = function (e) {
		img.src=reader.result;
	}
	return img
}
//check is image
function isFileImage(file){
	if (file.type.substring(0, 5)==='image'){
		return(true);
	}else{
		return(false);
	}
}

//start(this code is little slow, but quickly changed and more readable. That is why I have chosen this way it. Do not be severe)
function main(){
	if(mode[0]==='horizontal'){
		sizeImagesHorizontal(arrayOfImages,canvas);
	}else if(mode[0]==='vertical'){
		sizeImagesVertical(arrayOfImages,canvas);
	}
	makeSizedCanvasForImages(arrayOfImages,canvas);
	putInCanvasImages(arrayOfImages,canvas);
}
//end


//function called from 'onchange' event in input
function fileUploadedElement(){
	if ((this.files[0]!=undefined)&&(this.files[0]!=null)){
		if (isFileImage(this.files[0])){
			let positionOfImage=fromWhichInputWasEvent(this,inputs);
			let img = createImage(this.files[0]);
			arrayOfImages[positionOfImage]=img;
			img.onload = function(e){
				main();
			}
		}else{
			this.value='';
			let positionOfImage=fromWhichInputWasEvent(this,inputs);
			arrayOfImages[positionOfImage]=null;
			main();
		}
	}else{
		this.value='';
		let positionOfImage=fromWhichInputWasEvent(this,inputs);
		arrayOfImages[positionOfImage]=null;
		main();
	}
}
//change value function
function changeMode(){
	mode[0]=this.value;
	main();
}
//find the parent with class 'divOfInputAndAllNecessaryThingth'
function findParentDivOfInputAndAllNecessaryThingth(object){
	let parentOf=null;
	let nowObject=object;
	while((nowObject)&&(parentOf==null)){
		nowObject = nowObject.parentElement;
		if (nowObject.classList.contains(classNameDivOfInputAndAllNecessaryThingth)){
			parentOf=nowObject;
		}
	}
	return parentOf;
}
//function to create newBlock
function inputClassDivCreate(){
	let parentBlock=findParentDivOfInputAndAllNecessaryThingth(this);
	if (parentBlock!=null){
		let clone=parentBlock.cloneNode(true);
		clone.getElementsByClassName(classNameUploadInput)[0].value='';
		parentBlock.parentNode.insertBefore(clone, parentBlock.nextSibling);
		let positionOfImage=fromWhichInputWasEvent(clone.getElementsByClassName(classNameUploadInput)[0],inputs);
		arrayOfImages.splice( positionOfImage, 0, null);
		addWholeEvents();
	}
}
//function to remove block
function inputClassDivRemove(){
	let parentBlock=findParentDivOfInputAndAllNecessaryThingth(this);
	if (parentBlock!=null){
		let positionOfImage=fromWhichInputWasEvent(parentBlock.getElementsByClassName(classNameUploadInput)[0],inputs);
		arrayOfImages.splice(positionOfImage,1);
		parentBlock.parentNode.removeChild(parentBlock);
		main();
	}
}
//MADE ONE MORE FUNCTION TO EASY RECHANGE DESIGN AND ANYTHING MORE
function addWholeEvents(){
	// add events to inputs
	let inputClassObjects=document.getElementsByClassName(classNameUploadInput);
	for (let i=0;i<inputClassObjects.length;i+=1){
		inputClassObjects[i].addEventListener('change',fileUploadedElement);
	}
	//add events to radio
	let radioNameObjects=document.getElementsByName(classNameRadioToChooseMode);
	for (let i=0;i<radioNameObjects.length;i+=1){
		radioNameObjects[i].addEventListener('change',changeMode);
	}
	//add events to button 'buttonToCreateUploadInput'
	let buttonToCreateUploadInputClassObjects=document.getElementsByClassName(classNamebuttonToCreateUploadInput);
	for (let i=0;i<buttonToCreateUploadInputClassObjects.length;i+=1){
		buttonToCreateUploadInputClassObjects[i].addEventListener('click',inputClassDivCreate);
	}
	//add events to button 'buttonToRemoveUploadInput'
	let buttonToRemoveUploadInputClassObjects=document.getElementsByClassName(classNamebuttonToRemoveUploadInput);
	for (let i=0;i<buttonToRemoveUploadInputClassObjects.length;i+=1){
		buttonToRemoveUploadInputClassObjects[i].addEventListener('click',inputClassDivRemove);
	}
}


//properties start
const classNameUploadInput='uploadInput';
const classNamebuttonToCreateUploadInput='buttonToCreateUploadInput';
const classNamebuttonToRemoveUploadInput='buttonToRemoveUploadInput';
const classNameRadioToChooseMode='RadioToChooseMode';
const classNameDivOfInputAndAllNecessaryThingth='divOfInputAndAllNecessaryThingth';
const canvas=document.getElementById('canvas');
const inputs=document.getElementsByClassName(classNameUploadInput);
const arrayOfImages=[null,null];
const mode=['horizontal'];
//properties end
addWholeEvents();
/* made by Roman Tkachenko 
phone: +380666138273 
email: rt.craz@gmail.com */
