import express from "express";
import * as IPFS from "ipfs-core";
import { CID } from "multiformats/cid"

async function print()
{
  // const ipfs=await IPFS.create();
  //The create is an async function

  let ipfs=await IPFS.create();
  let swarms=await ipfs.swarm;
  console.log(swarms.connect);
  //We need a peer id of the other user
  // const peerid="/12D3KooWLMUrxbpo6z6TxxNJUe5GUxfRZ97uCPcfcw1jcHjUU41z";
  // let connection=await ipfs.swarm.connect(peerid,(err)=>
  // {
  //   if(err)
  //   {
  //     console.log(err);
  //     console.log("There is an error while connecting to the ipfs",err);
  //   }
  // })

  
}

const add = async (content1, content2, content3, content4) => {
    const ipfs = await IPFS.create();
    const cid4 = await ipfs.dag.put({
      content: content4,
    });
    const cid3 = await ipfs.dag.put({
      content: content3,
      prev: cid4,
    });
    const cid2 = await ipfs.dag.put({
      content: content2,
      prev: cid3,
    });
    const cid1 = await ipfs.dag.put({
      content: content1,
      prev: cid2,
    });
  
    console.log("These are all the cids:", cid1, cid2, cid3, cid4);
    return cid1;
  };
  
  
  
  const get = async (contentid) => {
    let finalarr=[];
    const ipfs = await IPFS.create();
    let contentidfinal = contentid;
    //Now this is the function to get all the content back
    do {
      const data1 = await ipfs.dag.get(CID.parse(contentidfinal), {
        path: "/content",
      });
      const data2 = await ipfs.dag.get(CID.parse(contentidfinal), {
        path: "/prev",
      });
      console.log(data1.value);
      finalarr.push(data1.value);
      console.log(data2.value.content);
      finalarr.push(data2.value.content);
      contentidfinal = data2.value.prev;
      if (contentidfinal != undefined) {
        contentidfinal = contentidfinal.toString();
        //   console.log(contentidfinal.toString());
      }
    } while (contentidfinal);

    return finalarr;
  };
  
const server=new express();
server.use(express.json());

server.post('/api/ipfs/upload',async(req,res)=>
{
    let {str1,str2,str3,str4}=req.body;
    let cid=await add(str1,str2,str3,str4);
    console.log('This is the cid',cid.toString());
    await res.json({
        status:"ok",
        "contentid":cid.toString()
    })
    console.log("This is the message after the data was sent");
})

server.get('/api/ipfs/fetch',async(req,res)=>
{

  //Inside the get request we first take the content id 
  console.log(req.body);
  let {contentid}=req.body;
  //Now when the get request is made we first fetch the data using the get function and then 
  let finalarr=get(contentid);

  //Now that we have got the complete data using the get function
  res.json({
    status:"Ok",
    data:finalarr
  })

  
})

const PORT=4000;
server.listen(PORT,()=>
{
    console.log("The IPFS server is listening on port",PORT);
    // print();
})