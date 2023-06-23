import { HandlerResponse } from 'open_route';
import { FailureResponse, HttpMethod, OkResponse, Route } from 'open_route';

/**
 * @summary give cat food
 */
export interface GiveCatFoodRequest {
  body: {
    /**
     * @description unit of amount
     */
    unit: 'kg' | 'g',
    /**
     * @description how much food to give to cat
     */
    amount: number;
  }
}

export interface GiveCatFoodResponseBody {
  isFoodFinished: boolean;
}

/**
 * @summary give cat some food
 * @consumes multipart/form-data
 */
export class GiveCatFoodRoute implements Route<GiveCatFoodRequest, GiveCatFoodResponseBody> {
  readonly path = "/give-food-to-cat";
  readonly method = HttpMethod.post;


  async handle(request: GiveCatFoodRequest): Promise<HandlerResponse<GiveCatFoodResponseBody>> {
    let amount = request.body.amount;
    if (request.body.unit == 'kg') {
      amount = amount * 1000;
    }

    // 124g of cat food to cat is ok
    if (amount < 125) {
      return new OkResponse({ isFoodFinished: true });
      // he won't finish his food with 8kg
    } else if (amount <= 8000) {
      return new OkResponse({ isFoodFinished: false });
      // this is getting out of hand
    } else {
      return new FailureResponse(400, `Cannot give more than 8kg of cat food to cat`);
    }
  }
}