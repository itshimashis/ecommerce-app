class ApiFeatures {
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString
    }
    search(){
        const keyword=this.queryString.keyword?{
           name:{
            $regex:this.queryString.keyword,
            $options:"i"
           }
        }:{};
        this.query=this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy={...this.queryString};
        
        const removalList=["keyword","page","limit"]; //if keyword is there that is for search()

        //pagination work is for some different function
        removalList.forEach((key)=>delete queryCopy[key]);
        

        let queryStr=JSON.stringify(queryCopy) ;
         
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);

        //gt->grater than , lt->lower than but to implement this filter
        //In case of mongodb there should be $ sign before filtering

        this.query=this.query.find(JSON.parse(queryStr));

        return this;
    }
    pagination(resultPerpage){
        const currentPage=Number(this.queryString.page)||1;
        const skip=resultPerpage*(currentPage-1); //how many products to skip
        this.query=this.query.limit(resultPerpage).skip(skip);
         return this;
    }
    
}

module.exports=ApiFeatures;