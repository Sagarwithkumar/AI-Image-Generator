const apiKey="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";
const maxImages=6;//max number of images to display
let selectedImageNumber=null;

// Function to generate a random number between min and max (inclusive)
 function getRandomNumber(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
 }

 //Function to disable the generate button during processing
 function disableGenerateButton(){
    document.getElementById("generate").disabled=true;
 }

 //Function to enable the generate button after process
 function enableGenerateButton(){
    document.getElementById("generate").disabled=false;
 }

 // Function to clear image grid
 function clearImageGrid(){
   const imageGrid= document.getElementById("image-grid");
   imageGrid.innerHTML="";
 }

 // Function to generate images
 async function generateImages(input){
    disableGenerateButton();
    clearImageGrid();

    const loading=document.getElementById("loading");
    loading.style.display="block";
    const imageUrls=[];
    for(let i=0;i<maxImages;i++){
        // Generate a random number between 1 and 10000 and append it to the prompt
        const randomNumber=getRandomNumber(1,100000);
        const prompt=`${input} ${randomNumber}`;
        const response=await fetch("https://api-inference.huggingface.co/models/prompthero/openjourney",{
         method:"POST",
         headers:{ "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body:JSON.stringify({inputs: prompt}),
      }
        );
        if(!response.ok){
            alert("Failed to generate images!");
        }
        const blob=await response.blob();
        const imageUrl=URL.createObjectURL(blob);
        imageUrls.push(imageUrl);
        
        const img=document.createElement("img");
        img.src=imageUrl;
        img.alt=`art-${i+1}`;
        img.onclick=()=>downloadImage(imageUrl,i); 
        document.getElementById("image-grid").appendChild(img);
    }
    loading.style.display="none";
    enableGenerateButton();
    selectedImageNumber=null;//reset selected image number
 }

 document.getElementById("generate").addEventListener("click",()=>{
    const input=document.getElementById("user-prompt").value;
    generateImages(input);
 }); 
 function downloadImage(imgUrl,imgNumber){
    const link=document.createElement("a");
    link.href=imgUrl;
    link.download=`image-${imgNumber+1}.jpg`;
    link.click();
 } 


