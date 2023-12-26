import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Template } from 'src/templates/schemas/template.schema';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      return ret;
    },
  },
  toObject: { virtuals: true },
})
export class Resume {
  @Prop({
    required: [true, 'Please provide a name'],
    maxlength: [40, 'Name should be under 40 characters'],
  })
  name: string;

  @Prop({
    type: Object,
    required: [true, 'Meta Data is missing'],
  })
  metaData: object;

  @Prop({
    default: false,
  })
  isPrivate: boolean;

  @Prop({
    required: [true, 'Thumbnail url is missing'],
  })
  thumbnail: string;

  @Prop({ type: Types.ObjectId, ref: Template.name })
  templateId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Users' })
  userId: Types.ObjectId;

  id?: string;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);

ResumeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
