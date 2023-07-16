export default async function handler(req, res) {
    if (req.method == 'GET') {

fetch('http://localhost:8000/gaapi/schedule')
  // .then(job_order => {
    // console.log(job_order); 
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // console.log(data[0].job_order);
    res.status(200).json({ message: data });

  })
  .catch(error => {
    console.error('Error:', error);

      res.status(500).json({ message:  error });
  });


    }else{
        console.log("error", req.method);
        res.status(405).json({ message: ' not allowed' });
    }
}
