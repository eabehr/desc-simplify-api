import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const options = {
    discriminatorKey: 'itemCategory',
    timestamps: true
};

const itemSchema = new Schema(
    {
        clientId: { type: String, required: true },
        submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        numberOfItems: { type: Number },
        urgency: {
            type: String,
            enum: ['survival', 'life-changing', 'important'],
            default: 'important'
        },
        status: {
            type: String,
            enum: ['active', 'approved', 'wishlist', 'archive', 'denied'],
            default: 'active'
        },
        notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
    },
    options
);

const Item = mongoose.model('Item', itemSchema);

export default Item;
