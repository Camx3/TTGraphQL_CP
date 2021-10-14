import { Service } from "typedi";
import { ObjectId } from "mongodb";

import FeatureModel from "./model";
import { Feature } from "../../entities"

@Service() // Dependencies injection
export default class FeatureService {
  constructor(private readonly featureModel: FeatureModel) {}

  public async getById(_id: ObjectId): Promise<Feature | null> {
    return this.featureModel.getById(_id);
  }

  /*public async addTodo(data: NewTodoInput): Promise<Todo> {
    const newTodo = await this.todoModel.create(data);

    // Business logic goes here
    // Example:
    // Trigger push notification, analytics, ...

    return newTodo;
  }*/
  
}
