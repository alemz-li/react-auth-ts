import { AnyZodObject, ZodEffects } from "zod";

type RequestValidator = {
  params?: AnyZodObject;
  body?: AnyZodObject | ZodEffects<AnyZodObject>;
  query?: AnyZodObject;
};

export default RequestValidator;
