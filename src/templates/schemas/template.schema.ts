import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TemplateDocument = HydratedDocument<Template>;

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
export class Template {
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
    default: true,
  })
  isActive: boolean;

  @Prop({
    required: [true, 'Thumbnail url is missing'],
  })
  thumbnail: string;

  @Prop({
    type: Object,
    required: [true, 'Form Schema is missing'],
  })
  formSchema: object;

  @Prop({
    type: Object,
    required: [true, 'Template is missing'],
  })
  template: object;

  id?: string;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);

TemplateSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
