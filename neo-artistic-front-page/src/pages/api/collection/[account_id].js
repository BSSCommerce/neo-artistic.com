import connectDB from 'src/middleware/mongodb';
import Collection from "src/models/Collection";

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            let collection = await Collection.findOne({
              account_id: req.query.account_id,
            });
            return res.status(200).send(collection ? collection : {});
        } catch (error) {
            return res.status(500).send(error.message);
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connectDB(handler);