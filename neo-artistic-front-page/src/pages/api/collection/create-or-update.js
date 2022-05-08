import connectDB from "src/middleware/mongodb";
import Collection from "src/models/Collection";

const handler = async (req, res) => {
  if (req.method === "POST") {
    // Check if name, logo or description is provided
    const {
      account_id,
      logo,
      banner,
      bio,
      email,
      website,
      collectionName,
    } = req.body;
    if (account_id) {
      try {
        let checkedCollection = await Collection.findOneAndUpdate(
          {
            account_id: account_id,
          },
          {
            account_id,
            logo,
            banner,
            bio,
            email,
            website,
            collection_name: collectionName,
          },
          { upsert: true }
        );
        // Create new user
        return res.status(200).send(checkedCollection);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    } else {
      res.status(422).send("data_incomplete");
    }
  } else {
    res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);
