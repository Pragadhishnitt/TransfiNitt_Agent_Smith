
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Template
 * 
 */
export type Template = $Result.DefaultSelection<Prisma.$TemplatePayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Respondent
 * 
 */
export type Respondent = $Result.DefaultSelection<Prisma.$RespondentPayload>
/**
 * Model Incentive
 * 
 */
export type Incentive = $Result.DefaultSelection<Prisma.$IncentivePayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.template`: Exposes CRUD operations for the **Template** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Templates
    * const templates = await prisma.template.findMany()
    * ```
    */
  get template(): Prisma.TemplateDelegate<ExtArgs>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs>;

  /**
   * `prisma.respondent`: Exposes CRUD operations for the **Respondent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Respondents
    * const respondents = await prisma.respondent.findMany()
    * ```
    */
  get respondent(): Prisma.RespondentDelegate<ExtArgs>;

  /**
   * `prisma.incentive`: Exposes CRUD operations for the **Incentive** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Incentives
    * const incentives = await prisma.incentive.findMany()
    * ```
    */
  get incentive(): Prisma.IncentiveDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Template: 'Template',
    Session: 'Session',
    Respondent: 'Respondent',
    Incentive: 'Incentive'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "template" | "session" | "respondent" | "incentive"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Template: {
        payload: Prisma.$TemplatePayload<ExtArgs>
        fields: Prisma.TemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          findFirst: {
            args: Prisma.TemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          findMany: {
            args: Prisma.TemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          create: {
            args: Prisma.TemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          createMany: {
            args: Prisma.TemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          delete: {
            args: Prisma.TemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          update: {
            args: Prisma.TemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          deleteMany: {
            args: Prisma.TemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          aggregate: {
            args: Prisma.TemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTemplate>
          }
          groupBy: {
            args: Prisma.TemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<TemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.TemplateCountArgs<ExtArgs>
            result: $Utils.Optional<TemplateCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Respondent: {
        payload: Prisma.$RespondentPayload<ExtArgs>
        fields: Prisma.RespondentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RespondentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespondentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RespondentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespondentPayload>
          }
          findFirst: {
            args: Prisma.RespondentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespondentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RespondentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespondentPayload>
          }
          findMany: {
            args: Prisma.RespondentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespondentPayload>[]
          }
          create: {
            args: Prisma.RespondentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespondentPayload>
          }
          createMany: {
            args: Prisma.RespondentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RespondentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespondentPayload>[]
          }
          delete: {
            args: Prisma.RespondentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespondentPayload>
          }
          update: {
            args: Prisma.RespondentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespondentPayload>
          }
          deleteMany: {
            args: Prisma.RespondentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RespondentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RespondentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespondentPayload>
          }
          aggregate: {
            args: Prisma.RespondentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRespondent>
          }
          groupBy: {
            args: Prisma.RespondentGroupByArgs<ExtArgs>
            result: $Utils.Optional<RespondentGroupByOutputType>[]
          }
          count: {
            args: Prisma.RespondentCountArgs<ExtArgs>
            result: $Utils.Optional<RespondentCountAggregateOutputType> | number
          }
        }
      }
      Incentive: {
        payload: Prisma.$IncentivePayload<ExtArgs>
        fields: Prisma.IncentiveFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IncentiveFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncentivePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IncentiveFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncentivePayload>
          }
          findFirst: {
            args: Prisma.IncentiveFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncentivePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IncentiveFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncentivePayload>
          }
          findMany: {
            args: Prisma.IncentiveFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncentivePayload>[]
          }
          create: {
            args: Prisma.IncentiveCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncentivePayload>
          }
          createMany: {
            args: Prisma.IncentiveCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IncentiveCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncentivePayload>[]
          }
          delete: {
            args: Prisma.IncentiveDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncentivePayload>
          }
          update: {
            args: Prisma.IncentiveUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncentivePayload>
          }
          deleteMany: {
            args: Prisma.IncentiveDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IncentiveUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.IncentiveUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncentivePayload>
          }
          aggregate: {
            args: Prisma.IncentiveAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIncentive>
          }
          groupBy: {
            args: Prisma.IncentiveGroupByArgs<ExtArgs>
            result: $Utils.Optional<IncentiveGroupByOutputType>[]
          }
          count: {
            args: Prisma.IncentiveCountArgs<ExtArgs>
            result: $Utils.Optional<IncentiveCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    templates: number
    sessions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    templates?: boolean | UserCountOutputTypeCountTemplatesArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTemplatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemplateWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }


  /**
   * Count Type TemplateCountOutputType
   */

  export type TemplateCountOutputType = {
    sessions: number
  }

  export type TemplateCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | TemplateCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * TemplateCountOutputType without action
   */
  export type TemplateCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemplateCountOutputType
     */
    select?: TemplateCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TemplateCountOutputType without action
   */
  export type TemplateCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }


  /**
   * Count Type SessionCountOutputType
   */

  export type SessionCountOutputType = {
    incentives: number
  }

  export type SessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    incentives?: boolean | SessionCountOutputTypeCountIncentivesArgs
  }

  // Custom InputTypes
  /**
   * SessionCountOutputType without action
   */
  export type SessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionCountOutputType
     */
    select?: SessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SessionCountOutputType without action
   */
  export type SessionCountOutputTypeCountIncentivesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IncentiveWhereInput
  }


  /**
   * Count Type RespondentCountOutputType
   */

  export type RespondentCountOutputType = {
    incentives: number
  }

  export type RespondentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    incentives?: boolean | RespondentCountOutputTypeCountIncentivesArgs
  }

  // Custom InputTypes
  /**
   * RespondentCountOutputType without action
   */
  export type RespondentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RespondentCountOutputType
     */
    select?: RespondentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RespondentCountOutputType without action
   */
  export type RespondentCountOutputTypeCountIncentivesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IncentiveWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password_hash: string | null
    role: string | null
    created_at: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password_hash: string | null
    role: string | null
    created_at: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password_hash: number
    role: number
    created_at: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password_hash?: true
    role?: true
    created_at?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password_hash?: true
    role?: true
    created_at?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password_hash?: true
    role?: true
    created_at?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password_hash: string
    role: string
    created_at: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password_hash?: boolean
    role?: boolean
    created_at?: boolean
    templates?: boolean | User$templatesArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    respondent?: boolean | User$respondentArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password_hash?: boolean
    role?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password_hash?: boolean
    role?: boolean
    created_at?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    templates?: boolean | User$templatesArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    respondent?: boolean | User$respondentArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      templates: Prisma.$TemplatePayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      respondent: Prisma.$RespondentPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password_hash: string
      role: string
      created_at: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    templates<T extends User$templatesArgs<ExtArgs> = {}>(args?: Subset<T, User$templatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findMany"> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany"> | Null>
    respondent<T extends User$respondentArgs<ExtArgs> = {}>(args?: Subset<T, User$respondentArgs<ExtArgs>>): Prisma__RespondentClient<$Result.GetResult<Prisma.$RespondentPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password_hash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly created_at: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.templates
   */
  export type User$templatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    where?: TemplateWhereInput
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    cursor?: TemplateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.respondent
   */
  export type User$respondentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Respondent
     */
    select?: RespondentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespondentInclude<ExtArgs> | null
    where?: RespondentWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Template
   */

  export type AggregateTemplate = {
    _count: TemplateCountAggregateOutputType | null
    _min: TemplateMinAggregateOutputType | null
    _max: TemplateMaxAggregateOutputType | null
  }

  export type TemplateMinAggregateOutputType = {
    id: string | null
    researcher_id: string | null
    title: string | null
    topic: string | null
    created_at: Date | null
  }

  export type TemplateMaxAggregateOutputType = {
    id: string | null
    researcher_id: string | null
    title: string | null
    topic: string | null
    created_at: Date | null
  }

  export type TemplateCountAggregateOutputType = {
    id: number
    researcher_id: number
    title: number
    topic: number
    starter_questions: number
    created_at: number
    _all: number
  }


  export type TemplateMinAggregateInputType = {
    id?: true
    researcher_id?: true
    title?: true
    topic?: true
    created_at?: true
  }

  export type TemplateMaxAggregateInputType = {
    id?: true
    researcher_id?: true
    title?: true
    topic?: true
    created_at?: true
  }

  export type TemplateCountAggregateInputType = {
    id?: true
    researcher_id?: true
    title?: true
    topic?: true
    starter_questions?: true
    created_at?: true
    _all?: true
  }

  export type TemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Template to aggregate.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Templates
    **/
    _count?: true | TemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TemplateMaxAggregateInputType
  }

  export type GetTemplateAggregateType<T extends TemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTemplate[P]>
      : GetScalarType<T[P], AggregateTemplate[P]>
  }




  export type TemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemplateWhereInput
    orderBy?: TemplateOrderByWithAggregationInput | TemplateOrderByWithAggregationInput[]
    by: TemplateScalarFieldEnum[] | TemplateScalarFieldEnum
    having?: TemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TemplateCountAggregateInputType | true
    _min?: TemplateMinAggregateInputType
    _max?: TemplateMaxAggregateInputType
  }

  export type TemplateGroupByOutputType = {
    id: string
    researcher_id: string
    title: string
    topic: string | null
    starter_questions: JsonValue
    created_at: Date
    _count: TemplateCountAggregateOutputType | null
    _min: TemplateMinAggregateOutputType | null
    _max: TemplateMaxAggregateOutputType | null
  }

  type GetTemplateGroupByPayload<T extends TemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TemplateGroupByOutputType[P]>
            : GetScalarType<T[P], TemplateGroupByOutputType[P]>
        }
      >
    >


  export type TemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    researcher_id?: boolean
    title?: boolean
    topic?: boolean
    starter_questions?: boolean
    created_at?: boolean
    researcher?: boolean | UserDefaultArgs<ExtArgs>
    sessions?: boolean | Template$sessionsArgs<ExtArgs>
    _count?: boolean | TemplateCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["template"]>

  export type TemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    researcher_id?: boolean
    title?: boolean
    topic?: boolean
    starter_questions?: boolean
    created_at?: boolean
    researcher?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["template"]>

  export type TemplateSelectScalar = {
    id?: boolean
    researcher_id?: boolean
    title?: boolean
    topic?: boolean
    starter_questions?: boolean
    created_at?: boolean
  }

  export type TemplateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    researcher?: boolean | UserDefaultArgs<ExtArgs>
    sessions?: boolean | Template$sessionsArgs<ExtArgs>
    _count?: boolean | TemplateCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TemplateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    researcher?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Template"
    objects: {
      researcher: Prisma.$UserPayload<ExtArgs>
      sessions: Prisma.$SessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      researcher_id: string
      title: string
      topic: string | null
      starter_questions: Prisma.JsonValue
      created_at: Date
    }, ExtArgs["result"]["template"]>
    composites: {}
  }

  type TemplateGetPayload<S extends boolean | null | undefined | TemplateDefaultArgs> = $Result.GetResult<Prisma.$TemplatePayload, S>

  type TemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TemplateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TemplateCountAggregateInputType | true
    }

  export interface TemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Template'], meta: { name: 'Template' } }
    /**
     * Find zero or one Template that matches the filter.
     * @param {TemplateFindUniqueArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TemplateFindUniqueArgs>(args: SelectSubset<T, TemplateFindUniqueArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Template that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TemplateFindUniqueOrThrowArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, TemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Template that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindFirstArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TemplateFindFirstArgs>(args?: SelectSubset<T, TemplateFindFirstArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Template that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindFirstOrThrowArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, TemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Templates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Templates
     * const templates = await prisma.template.findMany()
     * 
     * // Get first 10 Templates
     * const templates = await prisma.template.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const templateWithIdOnly = await prisma.template.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TemplateFindManyArgs>(args?: SelectSubset<T, TemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Template.
     * @param {TemplateCreateArgs} args - Arguments to create a Template.
     * @example
     * // Create one Template
     * const Template = await prisma.template.create({
     *   data: {
     *     // ... data to create a Template
     *   }
     * })
     * 
     */
    create<T extends TemplateCreateArgs>(args: SelectSubset<T, TemplateCreateArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Templates.
     * @param {TemplateCreateManyArgs} args - Arguments to create many Templates.
     * @example
     * // Create many Templates
     * const template = await prisma.template.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TemplateCreateManyArgs>(args?: SelectSubset<T, TemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Templates and returns the data saved in the database.
     * @param {TemplateCreateManyAndReturnArgs} args - Arguments to create many Templates.
     * @example
     * // Create many Templates
     * const template = await prisma.template.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Templates and only return the `id`
     * const templateWithIdOnly = await prisma.template.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, TemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Template.
     * @param {TemplateDeleteArgs} args - Arguments to delete one Template.
     * @example
     * // Delete one Template
     * const Template = await prisma.template.delete({
     *   where: {
     *     // ... filter to delete one Template
     *   }
     * })
     * 
     */
    delete<T extends TemplateDeleteArgs>(args: SelectSubset<T, TemplateDeleteArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Template.
     * @param {TemplateUpdateArgs} args - Arguments to update one Template.
     * @example
     * // Update one Template
     * const template = await prisma.template.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TemplateUpdateArgs>(args: SelectSubset<T, TemplateUpdateArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Templates.
     * @param {TemplateDeleteManyArgs} args - Arguments to filter Templates to delete.
     * @example
     * // Delete a few Templates
     * const { count } = await prisma.template.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TemplateDeleteManyArgs>(args?: SelectSubset<T, TemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Templates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Templates
     * const template = await prisma.template.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TemplateUpdateManyArgs>(args: SelectSubset<T, TemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Template.
     * @param {TemplateUpsertArgs} args - Arguments to update or create a Template.
     * @example
     * // Update or create a Template
     * const template = await prisma.template.upsert({
     *   create: {
     *     // ... data to create a Template
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Template we want to update
     *   }
     * })
     */
    upsert<T extends TemplateUpsertArgs>(args: SelectSubset<T, TemplateUpsertArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Templates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateCountArgs} args - Arguments to filter Templates to count.
     * @example
     * // Count the number of Templates
     * const count = await prisma.template.count({
     *   where: {
     *     // ... the filter for the Templates we want to count
     *   }
     * })
    **/
    count<T extends TemplateCountArgs>(
      args?: Subset<T, TemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Template.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TemplateAggregateArgs>(args: Subset<T, TemplateAggregateArgs>): Prisma.PrismaPromise<GetTemplateAggregateType<T>>

    /**
     * Group by Template.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TemplateGroupByArgs['orderBy'] }
        : { orderBy?: TemplateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Template model
   */
  readonly fields: TemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Template.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    researcher<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    sessions<T extends Template$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, Template$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Template model
   */ 
  interface TemplateFieldRefs {
    readonly id: FieldRef<"Template", 'String'>
    readonly researcher_id: FieldRef<"Template", 'String'>
    readonly title: FieldRef<"Template", 'String'>
    readonly topic: FieldRef<"Template", 'String'>
    readonly starter_questions: FieldRef<"Template", 'Json'>
    readonly created_at: FieldRef<"Template", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Template findUnique
   */
  export type TemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template findUniqueOrThrow
   */
  export type TemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template findFirst
   */
  export type TemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Templates.
     */
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template findFirstOrThrow
   */
  export type TemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Templates.
     */
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template findMany
   */
  export type TemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Templates to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template create
   */
  export type TemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * The data needed to create a Template.
     */
    data: XOR<TemplateCreateInput, TemplateUncheckedCreateInput>
  }

  /**
   * Template createMany
   */
  export type TemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Templates.
     */
    data: TemplateCreateManyInput | TemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Template createManyAndReturn
   */
  export type TemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Templates.
     */
    data: TemplateCreateManyInput | TemplateCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Template update
   */
  export type TemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * The data needed to update a Template.
     */
    data: XOR<TemplateUpdateInput, TemplateUncheckedUpdateInput>
    /**
     * Choose, which Template to update.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template updateMany
   */
  export type TemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Templates.
     */
    data: XOR<TemplateUpdateManyMutationInput, TemplateUncheckedUpdateManyInput>
    /**
     * Filter which Templates to update
     */
    where?: TemplateWhereInput
  }

  /**
   * Template upsert
   */
  export type TemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * The filter to search for the Template to update in case it exists.
     */
    where: TemplateWhereUniqueInput
    /**
     * In case the Template found by the `where` argument doesn't exist, create a new Template with this data.
     */
    create: XOR<TemplateCreateInput, TemplateUncheckedCreateInput>
    /**
     * In case the Template was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TemplateUpdateInput, TemplateUncheckedUpdateInput>
  }

  /**
   * Template delete
   */
  export type TemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter which Template to delete.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template deleteMany
   */
  export type TemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Templates to delete
     */
    where?: TemplateWhereInput
  }

  /**
   * Template.sessions
   */
  export type Template$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Template without action
   */
  export type TemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _avg: SessionAvgAggregateOutputType | null
    _sum: SessionSumAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionAvgAggregateOutputType = {
    sentiment_score: Decimal | null
    duration_seconds: number | null
  }

  export type SessionSumAggregateOutputType = {
    sentiment_score: Decimal | null
    duration_seconds: number | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    template_id: string | null
    respondent_id: string | null
    status: string | null
    summary: string | null
    sentiment_score: Decimal | null
    started_at: Date | null
    completed_at: Date | null
    duration_seconds: number | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    template_id: string | null
    respondent_id: string | null
    status: string | null
    summary: string | null
    sentiment_score: Decimal | null
    started_at: Date | null
    completed_at: Date | null
    duration_seconds: number | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    template_id: number
    respondent_id: number
    status: number
    transcript: number
    summary: number
    sentiment_score: number
    key_themes: number
    started_at: number
    completed_at: number
    duration_seconds: number
    _all: number
  }


  export type SessionAvgAggregateInputType = {
    sentiment_score?: true
    duration_seconds?: true
  }

  export type SessionSumAggregateInputType = {
    sentiment_score?: true
    duration_seconds?: true
  }

  export type SessionMinAggregateInputType = {
    id?: true
    template_id?: true
    respondent_id?: true
    status?: true
    summary?: true
    sentiment_score?: true
    started_at?: true
    completed_at?: true
    duration_seconds?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    template_id?: true
    respondent_id?: true
    status?: true
    summary?: true
    sentiment_score?: true
    started_at?: true
    completed_at?: true
    duration_seconds?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    template_id?: true
    respondent_id?: true
    status?: true
    transcript?: true
    summary?: true
    sentiment_score?: true
    key_themes?: true
    started_at?: true
    completed_at?: true
    duration_seconds?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _avg?: SessionAvgAggregateInputType
    _sum?: SessionSumAggregateInputType
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    template_id: string
    respondent_id: string
    status: string
    transcript: JsonValue | null
    summary: string | null
    sentiment_score: Decimal | null
    key_themes: JsonValue | null
    started_at: Date | null
    completed_at: Date | null
    duration_seconds: number | null
    _count: SessionCountAggregateOutputType | null
    _avg: SessionAvgAggregateOutputType | null
    _sum: SessionSumAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    template_id?: boolean
    respondent_id?: boolean
    status?: boolean
    transcript?: boolean
    summary?: boolean
    sentiment_score?: boolean
    key_themes?: boolean
    started_at?: boolean
    completed_at?: boolean
    duration_seconds?: boolean
    template?: boolean | TemplateDefaultArgs<ExtArgs>
    respondent?: boolean | UserDefaultArgs<ExtArgs>
    incentives?: boolean | Session$incentivesArgs<ExtArgs>
    _count?: boolean | SessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    template_id?: boolean
    respondent_id?: boolean
    status?: boolean
    transcript?: boolean
    summary?: boolean
    sentiment_score?: boolean
    key_themes?: boolean
    started_at?: boolean
    completed_at?: boolean
    duration_seconds?: boolean
    template?: boolean | TemplateDefaultArgs<ExtArgs>
    respondent?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    template_id?: boolean
    respondent_id?: boolean
    status?: boolean
    transcript?: boolean
    summary?: boolean
    sentiment_score?: boolean
    key_themes?: boolean
    started_at?: boolean
    completed_at?: boolean
    duration_seconds?: boolean
  }

  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    template?: boolean | TemplateDefaultArgs<ExtArgs>
    respondent?: boolean | UserDefaultArgs<ExtArgs>
    incentives?: boolean | Session$incentivesArgs<ExtArgs>
    _count?: boolean | SessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    template?: boolean | TemplateDefaultArgs<ExtArgs>
    respondent?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      template: Prisma.$TemplatePayload<ExtArgs>
      respondent: Prisma.$UserPayload<ExtArgs>
      incentives: Prisma.$IncentivePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      template_id: string
      respondent_id: string
      status: string
      transcript: Prisma.JsonValue | null
      summary: string | null
      sentiment_score: Prisma.Decimal | null
      key_themes: Prisma.JsonValue | null
      started_at: Date | null
      completed_at: Date | null
      duration_seconds: number | null
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    template<T extends TemplateDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TemplateDefaultArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    respondent<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    incentives<T extends Session$incentivesArgs<ExtArgs> = {}>(args?: Subset<T, Session$incentivesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IncentivePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */ 
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly template_id: FieldRef<"Session", 'String'>
    readonly respondent_id: FieldRef<"Session", 'String'>
    readonly status: FieldRef<"Session", 'String'>
    readonly transcript: FieldRef<"Session", 'Json'>
    readonly summary: FieldRef<"Session", 'String'>
    readonly sentiment_score: FieldRef<"Session", 'Decimal'>
    readonly key_themes: FieldRef<"Session", 'Json'>
    readonly started_at: FieldRef<"Session", 'DateTime'>
    readonly completed_at: FieldRef<"Session", 'DateTime'>
    readonly duration_seconds: FieldRef<"Session", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
  }

  /**
   * Session.incentives
   */
  export type Session$incentivesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incentive
     */
    select?: IncentiveSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncentiveInclude<ExtArgs> | null
    where?: IncentiveWhereInput
    orderBy?: IncentiveOrderByWithRelationInput | IncentiveOrderByWithRelationInput[]
    cursor?: IncentiveWhereUniqueInput
    take?: number
    skip?: number
    distinct?: IncentiveScalarFieldEnum | IncentiveScalarFieldEnum[]
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Respondent
   */

  export type AggregateRespondent = {
    _count: RespondentCountAggregateOutputType | null
    _avg: RespondentAvgAggregateOutputType | null
    _sum: RespondentSumAggregateOutputType | null
    _min: RespondentMinAggregateOutputType | null
    _max: RespondentMaxAggregateOutputType | null
  }

  export type RespondentAvgAggregateOutputType = {
    participation_count: number | null
    total_incentives: Decimal | null
    avg_sentiment: Decimal | null
  }

  export type RespondentSumAggregateOutputType = {
    participation_count: number | null
    total_incentives: Decimal | null
    avg_sentiment: Decimal | null
  }

  export type RespondentMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    name: string | null
    participation_count: number | null
    total_incentives: Decimal | null
    avg_sentiment: Decimal | null
  }

  export type RespondentMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    name: string | null
    participation_count: number | null
    total_incentives: Decimal | null
    avg_sentiment: Decimal | null
  }

  export type RespondentCountAggregateOutputType = {
    id: number
    user_id: number
    name: number
    demographics: number
    participation_count: number
    total_incentives: number
    avg_sentiment: number
    behavior_tags: number
    _all: number
  }


  export type RespondentAvgAggregateInputType = {
    participation_count?: true
    total_incentives?: true
    avg_sentiment?: true
  }

  export type RespondentSumAggregateInputType = {
    participation_count?: true
    total_incentives?: true
    avg_sentiment?: true
  }

  export type RespondentMinAggregateInputType = {
    id?: true
    user_id?: true
    name?: true
    participation_count?: true
    total_incentives?: true
    avg_sentiment?: true
  }

  export type RespondentMaxAggregateInputType = {
    id?: true
    user_id?: true
    name?: true
    participation_count?: true
    total_incentives?: true
    avg_sentiment?: true
  }

  export type RespondentCountAggregateInputType = {
    id?: true
    user_id?: true
    name?: true
    demographics?: true
    participation_count?: true
    total_incentives?: true
    avg_sentiment?: true
    behavior_tags?: true
    _all?: true
  }

  export type RespondentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Respondent to aggregate.
     */
    where?: RespondentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Respondents to fetch.
     */
    orderBy?: RespondentOrderByWithRelationInput | RespondentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RespondentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Respondents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Respondents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Respondents
    **/
    _count?: true | RespondentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RespondentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RespondentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RespondentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RespondentMaxAggregateInputType
  }

  export type GetRespondentAggregateType<T extends RespondentAggregateArgs> = {
        [P in keyof T & keyof AggregateRespondent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRespondent[P]>
      : GetScalarType<T[P], AggregateRespondent[P]>
  }




  export type RespondentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RespondentWhereInput
    orderBy?: RespondentOrderByWithAggregationInput | RespondentOrderByWithAggregationInput[]
    by: RespondentScalarFieldEnum[] | RespondentScalarFieldEnum
    having?: RespondentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RespondentCountAggregateInputType | true
    _avg?: RespondentAvgAggregateInputType
    _sum?: RespondentSumAggregateInputType
    _min?: RespondentMinAggregateInputType
    _max?: RespondentMaxAggregateInputType
  }

  export type RespondentGroupByOutputType = {
    id: string
    user_id: string
    name: string
    demographics: JsonValue | null
    participation_count: number
    total_incentives: Decimal | null
    avg_sentiment: Decimal | null
    behavior_tags: JsonValue | null
    _count: RespondentCountAggregateOutputType | null
    _avg: RespondentAvgAggregateOutputType | null
    _sum: RespondentSumAggregateOutputType | null
    _min: RespondentMinAggregateOutputType | null
    _max: RespondentMaxAggregateOutputType | null
  }

  type GetRespondentGroupByPayload<T extends RespondentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RespondentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RespondentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RespondentGroupByOutputType[P]>
            : GetScalarType<T[P], RespondentGroupByOutputType[P]>
        }
      >
    >


  export type RespondentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    name?: boolean
    demographics?: boolean
    participation_count?: boolean
    total_incentives?: boolean
    avg_sentiment?: boolean
    behavior_tags?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    incentives?: boolean | Respondent$incentivesArgs<ExtArgs>
    _count?: boolean | RespondentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["respondent"]>

  export type RespondentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    name?: boolean
    demographics?: boolean
    participation_count?: boolean
    total_incentives?: boolean
    avg_sentiment?: boolean
    behavior_tags?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["respondent"]>

  export type RespondentSelectScalar = {
    id?: boolean
    user_id?: boolean
    name?: boolean
    demographics?: boolean
    participation_count?: boolean
    total_incentives?: boolean
    avg_sentiment?: boolean
    behavior_tags?: boolean
  }

  export type RespondentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    incentives?: boolean | Respondent$incentivesArgs<ExtArgs>
    _count?: boolean | RespondentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RespondentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RespondentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Respondent"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      incentives: Prisma.$IncentivePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      name: string
      demographics: Prisma.JsonValue | null
      participation_count: number
      total_incentives: Prisma.Decimal | null
      avg_sentiment: Prisma.Decimal | null
      behavior_tags: Prisma.JsonValue | null
    }, ExtArgs["result"]["respondent"]>
    composites: {}
  }

  type RespondentGetPayload<S extends boolean | null | undefined | RespondentDefaultArgs> = $Result.GetResult<Prisma.$RespondentPayload, S>

  type RespondentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RespondentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RespondentCountAggregateInputType | true
    }

  export interface RespondentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Respondent'], meta: { name: 'Respondent' } }
    /**
     * Find zero or one Respondent that matches the filter.
     * @param {RespondentFindUniqueArgs} args - Arguments to find a Respondent
     * @example
     * // Get one Respondent
     * const respondent = await prisma.respondent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RespondentFindUniqueArgs>(args: SelectSubset<T, RespondentFindUniqueArgs<ExtArgs>>): Prisma__RespondentClient<$Result.GetResult<Prisma.$RespondentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Respondent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RespondentFindUniqueOrThrowArgs} args - Arguments to find a Respondent
     * @example
     * // Get one Respondent
     * const respondent = await prisma.respondent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RespondentFindUniqueOrThrowArgs>(args: SelectSubset<T, RespondentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RespondentClient<$Result.GetResult<Prisma.$RespondentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Respondent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespondentFindFirstArgs} args - Arguments to find a Respondent
     * @example
     * // Get one Respondent
     * const respondent = await prisma.respondent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RespondentFindFirstArgs>(args?: SelectSubset<T, RespondentFindFirstArgs<ExtArgs>>): Prisma__RespondentClient<$Result.GetResult<Prisma.$RespondentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Respondent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespondentFindFirstOrThrowArgs} args - Arguments to find a Respondent
     * @example
     * // Get one Respondent
     * const respondent = await prisma.respondent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RespondentFindFirstOrThrowArgs>(args?: SelectSubset<T, RespondentFindFirstOrThrowArgs<ExtArgs>>): Prisma__RespondentClient<$Result.GetResult<Prisma.$RespondentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Respondents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespondentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Respondents
     * const respondents = await prisma.respondent.findMany()
     * 
     * // Get first 10 Respondents
     * const respondents = await prisma.respondent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const respondentWithIdOnly = await prisma.respondent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RespondentFindManyArgs>(args?: SelectSubset<T, RespondentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespondentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Respondent.
     * @param {RespondentCreateArgs} args - Arguments to create a Respondent.
     * @example
     * // Create one Respondent
     * const Respondent = await prisma.respondent.create({
     *   data: {
     *     // ... data to create a Respondent
     *   }
     * })
     * 
     */
    create<T extends RespondentCreateArgs>(args: SelectSubset<T, RespondentCreateArgs<ExtArgs>>): Prisma__RespondentClient<$Result.GetResult<Prisma.$RespondentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Respondents.
     * @param {RespondentCreateManyArgs} args - Arguments to create many Respondents.
     * @example
     * // Create many Respondents
     * const respondent = await prisma.respondent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RespondentCreateManyArgs>(args?: SelectSubset<T, RespondentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Respondents and returns the data saved in the database.
     * @param {RespondentCreateManyAndReturnArgs} args - Arguments to create many Respondents.
     * @example
     * // Create many Respondents
     * const respondent = await prisma.respondent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Respondents and only return the `id`
     * const respondentWithIdOnly = await prisma.respondent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RespondentCreateManyAndReturnArgs>(args?: SelectSubset<T, RespondentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespondentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Respondent.
     * @param {RespondentDeleteArgs} args - Arguments to delete one Respondent.
     * @example
     * // Delete one Respondent
     * const Respondent = await prisma.respondent.delete({
     *   where: {
     *     // ... filter to delete one Respondent
     *   }
     * })
     * 
     */
    delete<T extends RespondentDeleteArgs>(args: SelectSubset<T, RespondentDeleteArgs<ExtArgs>>): Prisma__RespondentClient<$Result.GetResult<Prisma.$RespondentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Respondent.
     * @param {RespondentUpdateArgs} args - Arguments to update one Respondent.
     * @example
     * // Update one Respondent
     * const respondent = await prisma.respondent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RespondentUpdateArgs>(args: SelectSubset<T, RespondentUpdateArgs<ExtArgs>>): Prisma__RespondentClient<$Result.GetResult<Prisma.$RespondentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Respondents.
     * @param {RespondentDeleteManyArgs} args - Arguments to filter Respondents to delete.
     * @example
     * // Delete a few Respondents
     * const { count } = await prisma.respondent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RespondentDeleteManyArgs>(args?: SelectSubset<T, RespondentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Respondents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespondentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Respondents
     * const respondent = await prisma.respondent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RespondentUpdateManyArgs>(args: SelectSubset<T, RespondentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Respondent.
     * @param {RespondentUpsertArgs} args - Arguments to update or create a Respondent.
     * @example
     * // Update or create a Respondent
     * const respondent = await prisma.respondent.upsert({
     *   create: {
     *     // ... data to create a Respondent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Respondent we want to update
     *   }
     * })
     */
    upsert<T extends RespondentUpsertArgs>(args: SelectSubset<T, RespondentUpsertArgs<ExtArgs>>): Prisma__RespondentClient<$Result.GetResult<Prisma.$RespondentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Respondents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespondentCountArgs} args - Arguments to filter Respondents to count.
     * @example
     * // Count the number of Respondents
     * const count = await prisma.respondent.count({
     *   where: {
     *     // ... the filter for the Respondents we want to count
     *   }
     * })
    **/
    count<T extends RespondentCountArgs>(
      args?: Subset<T, RespondentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RespondentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Respondent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespondentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RespondentAggregateArgs>(args: Subset<T, RespondentAggregateArgs>): Prisma.PrismaPromise<GetRespondentAggregateType<T>>

    /**
     * Group by Respondent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespondentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RespondentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RespondentGroupByArgs['orderBy'] }
        : { orderBy?: RespondentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RespondentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRespondentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Respondent model
   */
  readonly fields: RespondentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Respondent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RespondentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    incentives<T extends Respondent$incentivesArgs<ExtArgs> = {}>(args?: Subset<T, Respondent$incentivesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IncentivePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Respondent model
   */ 
  interface RespondentFieldRefs {
    readonly id: FieldRef<"Respondent", 'String'>
    readonly user_id: FieldRef<"Respondent", 'String'>
    readonly name: FieldRef<"Respondent", 'String'>
    readonly demographics: FieldRef<"Respondent", 'Json'>
    readonly participation_count: FieldRef<"Respondent", 'Int'>
    readonly total_incentives: FieldRef<"Respondent", 'Decimal'>
    readonly avg_sentiment: FieldRef<"Respondent", 'Decimal'>
    readonly behavior_tags: FieldRef<"Respondent", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Respondent findUnique
   */
  export type RespondentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Respondent
     */
    select?: RespondentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespondentInclude<ExtArgs> | null
    /**
     * Filter, which Respondent to fetch.
     */
    where: RespondentWhereUniqueInput
  }

  /**
   * Respondent findUniqueOrThrow
   */
  export type RespondentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Respondent
     */
    select?: RespondentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespondentInclude<ExtArgs> | null
    /**
     * Filter, which Respondent to fetch.
     */
    where: RespondentWhereUniqueInput
  }

  /**
   * Respondent findFirst
   */
  export type RespondentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Respondent
     */
    select?: RespondentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespondentInclude<ExtArgs> | null
    /**
     * Filter, which Respondent to fetch.
     */
    where?: RespondentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Respondents to fetch.
     */
    orderBy?: RespondentOrderByWithRelationInput | RespondentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Respondents.
     */
    cursor?: RespondentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Respondents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Respondents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Respondents.
     */
    distinct?: RespondentScalarFieldEnum | RespondentScalarFieldEnum[]
  }

  /**
   * Respondent findFirstOrThrow
   */
  export type RespondentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Respondent
     */
    select?: RespondentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespondentInclude<ExtArgs> | null
    /**
     * Filter, which Respondent to fetch.
     */
    where?: RespondentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Respondents to fetch.
     */
    orderBy?: RespondentOrderByWithRelationInput | RespondentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Respondents.
     */
    cursor?: RespondentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Respondents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Respondents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Respondents.
     */
    distinct?: RespondentScalarFieldEnum | RespondentScalarFieldEnum[]
  }

  /**
   * Respondent findMany
   */
  export type RespondentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Respondent
     */
    select?: RespondentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespondentInclude<ExtArgs> | null
    /**
     * Filter, which Respondents to fetch.
     */
    where?: RespondentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Respondents to fetch.
     */
    orderBy?: RespondentOrderByWithRelationInput | RespondentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Respondents.
     */
    cursor?: RespondentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Respondents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Respondents.
     */
    skip?: number
    distinct?: RespondentScalarFieldEnum | RespondentScalarFieldEnum[]
  }

  /**
   * Respondent create
   */
  export type RespondentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Respondent
     */
    select?: RespondentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespondentInclude<ExtArgs> | null
    /**
     * The data needed to create a Respondent.
     */
    data: XOR<RespondentCreateInput, RespondentUncheckedCreateInput>
  }

  /**
   * Respondent createMany
   */
  export type RespondentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Respondents.
     */
    data: RespondentCreateManyInput | RespondentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Respondent createManyAndReturn
   */
  export type RespondentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Respondent
     */
    select?: RespondentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Respondents.
     */
    data: RespondentCreateManyInput | RespondentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespondentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Respondent update
   */
  export type RespondentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Respondent
     */
    select?: RespondentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespondentInclude<ExtArgs> | null
    /**
     * The data needed to update a Respondent.
     */
    data: XOR<RespondentUpdateInput, RespondentUncheckedUpdateInput>
    /**
     * Choose, which Respondent to update.
     */
    where: RespondentWhereUniqueInput
  }

  /**
   * Respondent updateMany
   */
  export type RespondentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Respondents.
     */
    data: XOR<RespondentUpdateManyMutationInput, RespondentUncheckedUpdateManyInput>
    /**
     * Filter which Respondents to update
     */
    where?: RespondentWhereInput
  }

  /**
   * Respondent upsert
   */
  export type RespondentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Respondent
     */
    select?: RespondentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespondentInclude<ExtArgs> | null
    /**
     * The filter to search for the Respondent to update in case it exists.
     */
    where: RespondentWhereUniqueInput
    /**
     * In case the Respondent found by the `where` argument doesn't exist, create a new Respondent with this data.
     */
    create: XOR<RespondentCreateInput, RespondentUncheckedCreateInput>
    /**
     * In case the Respondent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RespondentUpdateInput, RespondentUncheckedUpdateInput>
  }

  /**
   * Respondent delete
   */
  export type RespondentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Respondent
     */
    select?: RespondentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespondentInclude<ExtArgs> | null
    /**
     * Filter which Respondent to delete.
     */
    where: RespondentWhereUniqueInput
  }

  /**
   * Respondent deleteMany
   */
  export type RespondentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Respondents to delete
     */
    where?: RespondentWhereInput
  }

  /**
   * Respondent.incentives
   */
  export type Respondent$incentivesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incentive
     */
    select?: IncentiveSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncentiveInclude<ExtArgs> | null
    where?: IncentiveWhereInput
    orderBy?: IncentiveOrderByWithRelationInput | IncentiveOrderByWithRelationInput[]
    cursor?: IncentiveWhereUniqueInput
    take?: number
    skip?: number
    distinct?: IncentiveScalarFieldEnum | IncentiveScalarFieldEnum[]
  }

  /**
   * Respondent without action
   */
  export type RespondentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Respondent
     */
    select?: RespondentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespondentInclude<ExtArgs> | null
  }


  /**
   * Model Incentive
   */

  export type AggregateIncentive = {
    _count: IncentiveCountAggregateOutputType | null
    _avg: IncentiveAvgAggregateOutputType | null
    _sum: IncentiveSumAggregateOutputType | null
    _min: IncentiveMinAggregateOutputType | null
    _max: IncentiveMaxAggregateOutputType | null
  }

  export type IncentiveAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type IncentiveSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type IncentiveMinAggregateOutputType = {
    id: string | null
    respondent_id: string | null
    session_id: string | null
    amount: Decimal | null
    status: string | null
    paid_at: Date | null
  }

  export type IncentiveMaxAggregateOutputType = {
    id: string | null
    respondent_id: string | null
    session_id: string | null
    amount: Decimal | null
    status: string | null
    paid_at: Date | null
  }

  export type IncentiveCountAggregateOutputType = {
    id: number
    respondent_id: number
    session_id: number
    amount: number
    status: number
    paid_at: number
    _all: number
  }


  export type IncentiveAvgAggregateInputType = {
    amount?: true
  }

  export type IncentiveSumAggregateInputType = {
    amount?: true
  }

  export type IncentiveMinAggregateInputType = {
    id?: true
    respondent_id?: true
    session_id?: true
    amount?: true
    status?: true
    paid_at?: true
  }

  export type IncentiveMaxAggregateInputType = {
    id?: true
    respondent_id?: true
    session_id?: true
    amount?: true
    status?: true
    paid_at?: true
  }

  export type IncentiveCountAggregateInputType = {
    id?: true
    respondent_id?: true
    session_id?: true
    amount?: true
    status?: true
    paid_at?: true
    _all?: true
  }

  export type IncentiveAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Incentive to aggregate.
     */
    where?: IncentiveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Incentives to fetch.
     */
    orderBy?: IncentiveOrderByWithRelationInput | IncentiveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IncentiveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Incentives from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Incentives.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Incentives
    **/
    _count?: true | IncentiveCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IncentiveAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IncentiveSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IncentiveMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IncentiveMaxAggregateInputType
  }

  export type GetIncentiveAggregateType<T extends IncentiveAggregateArgs> = {
        [P in keyof T & keyof AggregateIncentive]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIncentive[P]>
      : GetScalarType<T[P], AggregateIncentive[P]>
  }




  export type IncentiveGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IncentiveWhereInput
    orderBy?: IncentiveOrderByWithAggregationInput | IncentiveOrderByWithAggregationInput[]
    by: IncentiveScalarFieldEnum[] | IncentiveScalarFieldEnum
    having?: IncentiveScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IncentiveCountAggregateInputType | true
    _avg?: IncentiveAvgAggregateInputType
    _sum?: IncentiveSumAggregateInputType
    _min?: IncentiveMinAggregateInputType
    _max?: IncentiveMaxAggregateInputType
  }

  export type IncentiveGroupByOutputType = {
    id: string
    respondent_id: string
    session_id: string
    amount: Decimal
    status: string
    paid_at: Date | null
    _count: IncentiveCountAggregateOutputType | null
    _avg: IncentiveAvgAggregateOutputType | null
    _sum: IncentiveSumAggregateOutputType | null
    _min: IncentiveMinAggregateOutputType | null
    _max: IncentiveMaxAggregateOutputType | null
  }

  type GetIncentiveGroupByPayload<T extends IncentiveGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IncentiveGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IncentiveGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IncentiveGroupByOutputType[P]>
            : GetScalarType<T[P], IncentiveGroupByOutputType[P]>
        }
      >
    >


  export type IncentiveSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    respondent_id?: boolean
    session_id?: boolean
    amount?: boolean
    status?: boolean
    paid_at?: boolean
    respondent?: boolean | RespondentDefaultArgs<ExtArgs>
    session?: boolean | SessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["incentive"]>

  export type IncentiveSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    respondent_id?: boolean
    session_id?: boolean
    amount?: boolean
    status?: boolean
    paid_at?: boolean
    respondent?: boolean | RespondentDefaultArgs<ExtArgs>
    session?: boolean | SessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["incentive"]>

  export type IncentiveSelectScalar = {
    id?: boolean
    respondent_id?: boolean
    session_id?: boolean
    amount?: boolean
    status?: boolean
    paid_at?: boolean
  }

  export type IncentiveInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    respondent?: boolean | RespondentDefaultArgs<ExtArgs>
    session?: boolean | SessionDefaultArgs<ExtArgs>
  }
  export type IncentiveIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    respondent?: boolean | RespondentDefaultArgs<ExtArgs>
    session?: boolean | SessionDefaultArgs<ExtArgs>
  }

  export type $IncentivePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Incentive"
    objects: {
      respondent: Prisma.$RespondentPayload<ExtArgs>
      session: Prisma.$SessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      respondent_id: string
      session_id: string
      amount: Prisma.Decimal
      status: string
      paid_at: Date | null
    }, ExtArgs["result"]["incentive"]>
    composites: {}
  }

  type IncentiveGetPayload<S extends boolean | null | undefined | IncentiveDefaultArgs> = $Result.GetResult<Prisma.$IncentivePayload, S>

  type IncentiveCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<IncentiveFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: IncentiveCountAggregateInputType | true
    }

  export interface IncentiveDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Incentive'], meta: { name: 'Incentive' } }
    /**
     * Find zero or one Incentive that matches the filter.
     * @param {IncentiveFindUniqueArgs} args - Arguments to find a Incentive
     * @example
     * // Get one Incentive
     * const incentive = await prisma.incentive.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IncentiveFindUniqueArgs>(args: SelectSubset<T, IncentiveFindUniqueArgs<ExtArgs>>): Prisma__IncentiveClient<$Result.GetResult<Prisma.$IncentivePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Incentive that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {IncentiveFindUniqueOrThrowArgs} args - Arguments to find a Incentive
     * @example
     * // Get one Incentive
     * const incentive = await prisma.incentive.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IncentiveFindUniqueOrThrowArgs>(args: SelectSubset<T, IncentiveFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IncentiveClient<$Result.GetResult<Prisma.$IncentivePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Incentive that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncentiveFindFirstArgs} args - Arguments to find a Incentive
     * @example
     * // Get one Incentive
     * const incentive = await prisma.incentive.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IncentiveFindFirstArgs>(args?: SelectSubset<T, IncentiveFindFirstArgs<ExtArgs>>): Prisma__IncentiveClient<$Result.GetResult<Prisma.$IncentivePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Incentive that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncentiveFindFirstOrThrowArgs} args - Arguments to find a Incentive
     * @example
     * // Get one Incentive
     * const incentive = await prisma.incentive.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IncentiveFindFirstOrThrowArgs>(args?: SelectSubset<T, IncentiveFindFirstOrThrowArgs<ExtArgs>>): Prisma__IncentiveClient<$Result.GetResult<Prisma.$IncentivePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Incentives that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncentiveFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Incentives
     * const incentives = await prisma.incentive.findMany()
     * 
     * // Get first 10 Incentives
     * const incentives = await prisma.incentive.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const incentiveWithIdOnly = await prisma.incentive.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IncentiveFindManyArgs>(args?: SelectSubset<T, IncentiveFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IncentivePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Incentive.
     * @param {IncentiveCreateArgs} args - Arguments to create a Incentive.
     * @example
     * // Create one Incentive
     * const Incentive = await prisma.incentive.create({
     *   data: {
     *     // ... data to create a Incentive
     *   }
     * })
     * 
     */
    create<T extends IncentiveCreateArgs>(args: SelectSubset<T, IncentiveCreateArgs<ExtArgs>>): Prisma__IncentiveClient<$Result.GetResult<Prisma.$IncentivePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Incentives.
     * @param {IncentiveCreateManyArgs} args - Arguments to create many Incentives.
     * @example
     * // Create many Incentives
     * const incentive = await prisma.incentive.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IncentiveCreateManyArgs>(args?: SelectSubset<T, IncentiveCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Incentives and returns the data saved in the database.
     * @param {IncentiveCreateManyAndReturnArgs} args - Arguments to create many Incentives.
     * @example
     * // Create many Incentives
     * const incentive = await prisma.incentive.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Incentives and only return the `id`
     * const incentiveWithIdOnly = await prisma.incentive.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IncentiveCreateManyAndReturnArgs>(args?: SelectSubset<T, IncentiveCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IncentivePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Incentive.
     * @param {IncentiveDeleteArgs} args - Arguments to delete one Incentive.
     * @example
     * // Delete one Incentive
     * const Incentive = await prisma.incentive.delete({
     *   where: {
     *     // ... filter to delete one Incentive
     *   }
     * })
     * 
     */
    delete<T extends IncentiveDeleteArgs>(args: SelectSubset<T, IncentiveDeleteArgs<ExtArgs>>): Prisma__IncentiveClient<$Result.GetResult<Prisma.$IncentivePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Incentive.
     * @param {IncentiveUpdateArgs} args - Arguments to update one Incentive.
     * @example
     * // Update one Incentive
     * const incentive = await prisma.incentive.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IncentiveUpdateArgs>(args: SelectSubset<T, IncentiveUpdateArgs<ExtArgs>>): Prisma__IncentiveClient<$Result.GetResult<Prisma.$IncentivePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Incentives.
     * @param {IncentiveDeleteManyArgs} args - Arguments to filter Incentives to delete.
     * @example
     * // Delete a few Incentives
     * const { count } = await prisma.incentive.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IncentiveDeleteManyArgs>(args?: SelectSubset<T, IncentiveDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Incentives.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncentiveUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Incentives
     * const incentive = await prisma.incentive.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IncentiveUpdateManyArgs>(args: SelectSubset<T, IncentiveUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Incentive.
     * @param {IncentiveUpsertArgs} args - Arguments to update or create a Incentive.
     * @example
     * // Update or create a Incentive
     * const incentive = await prisma.incentive.upsert({
     *   create: {
     *     // ... data to create a Incentive
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Incentive we want to update
     *   }
     * })
     */
    upsert<T extends IncentiveUpsertArgs>(args: SelectSubset<T, IncentiveUpsertArgs<ExtArgs>>): Prisma__IncentiveClient<$Result.GetResult<Prisma.$IncentivePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Incentives.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncentiveCountArgs} args - Arguments to filter Incentives to count.
     * @example
     * // Count the number of Incentives
     * const count = await prisma.incentive.count({
     *   where: {
     *     // ... the filter for the Incentives we want to count
     *   }
     * })
    **/
    count<T extends IncentiveCountArgs>(
      args?: Subset<T, IncentiveCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IncentiveCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Incentive.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncentiveAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IncentiveAggregateArgs>(args: Subset<T, IncentiveAggregateArgs>): Prisma.PrismaPromise<GetIncentiveAggregateType<T>>

    /**
     * Group by Incentive.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncentiveGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IncentiveGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IncentiveGroupByArgs['orderBy'] }
        : { orderBy?: IncentiveGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IncentiveGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIncentiveGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Incentive model
   */
  readonly fields: IncentiveFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Incentive.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IncentiveClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    respondent<T extends RespondentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RespondentDefaultArgs<ExtArgs>>): Prisma__RespondentClient<$Result.GetResult<Prisma.$RespondentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    session<T extends SessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SessionDefaultArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Incentive model
   */ 
  interface IncentiveFieldRefs {
    readonly id: FieldRef<"Incentive", 'String'>
    readonly respondent_id: FieldRef<"Incentive", 'String'>
    readonly session_id: FieldRef<"Incentive", 'String'>
    readonly amount: FieldRef<"Incentive", 'Decimal'>
    readonly status: FieldRef<"Incentive", 'String'>
    readonly paid_at: FieldRef<"Incentive", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Incentive findUnique
   */
  export type IncentiveFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incentive
     */
    select?: IncentiveSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncentiveInclude<ExtArgs> | null
    /**
     * Filter, which Incentive to fetch.
     */
    where: IncentiveWhereUniqueInput
  }

  /**
   * Incentive findUniqueOrThrow
   */
  export type IncentiveFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incentive
     */
    select?: IncentiveSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncentiveInclude<ExtArgs> | null
    /**
     * Filter, which Incentive to fetch.
     */
    where: IncentiveWhereUniqueInput
  }

  /**
   * Incentive findFirst
   */
  export type IncentiveFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incentive
     */
    select?: IncentiveSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncentiveInclude<ExtArgs> | null
    /**
     * Filter, which Incentive to fetch.
     */
    where?: IncentiveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Incentives to fetch.
     */
    orderBy?: IncentiveOrderByWithRelationInput | IncentiveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Incentives.
     */
    cursor?: IncentiveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Incentives from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Incentives.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Incentives.
     */
    distinct?: IncentiveScalarFieldEnum | IncentiveScalarFieldEnum[]
  }

  /**
   * Incentive findFirstOrThrow
   */
  export type IncentiveFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incentive
     */
    select?: IncentiveSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncentiveInclude<ExtArgs> | null
    /**
     * Filter, which Incentive to fetch.
     */
    where?: IncentiveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Incentives to fetch.
     */
    orderBy?: IncentiveOrderByWithRelationInput | IncentiveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Incentives.
     */
    cursor?: IncentiveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Incentives from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Incentives.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Incentives.
     */
    distinct?: IncentiveScalarFieldEnum | IncentiveScalarFieldEnum[]
  }

  /**
   * Incentive findMany
   */
  export type IncentiveFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incentive
     */
    select?: IncentiveSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncentiveInclude<ExtArgs> | null
    /**
     * Filter, which Incentives to fetch.
     */
    where?: IncentiveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Incentives to fetch.
     */
    orderBy?: IncentiveOrderByWithRelationInput | IncentiveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Incentives.
     */
    cursor?: IncentiveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Incentives from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Incentives.
     */
    skip?: number
    distinct?: IncentiveScalarFieldEnum | IncentiveScalarFieldEnum[]
  }

  /**
   * Incentive create
   */
  export type IncentiveCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incentive
     */
    select?: IncentiveSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncentiveInclude<ExtArgs> | null
    /**
     * The data needed to create a Incentive.
     */
    data: XOR<IncentiveCreateInput, IncentiveUncheckedCreateInput>
  }

  /**
   * Incentive createMany
   */
  export type IncentiveCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Incentives.
     */
    data: IncentiveCreateManyInput | IncentiveCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Incentive createManyAndReturn
   */
  export type IncentiveCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incentive
     */
    select?: IncentiveSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Incentives.
     */
    data: IncentiveCreateManyInput | IncentiveCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncentiveIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Incentive update
   */
  export type IncentiveUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incentive
     */
    select?: IncentiveSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncentiveInclude<ExtArgs> | null
    /**
     * The data needed to update a Incentive.
     */
    data: XOR<IncentiveUpdateInput, IncentiveUncheckedUpdateInput>
    /**
     * Choose, which Incentive to update.
     */
    where: IncentiveWhereUniqueInput
  }

  /**
   * Incentive updateMany
   */
  export type IncentiveUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Incentives.
     */
    data: XOR<IncentiveUpdateManyMutationInput, IncentiveUncheckedUpdateManyInput>
    /**
     * Filter which Incentives to update
     */
    where?: IncentiveWhereInput
  }

  /**
   * Incentive upsert
   */
  export type IncentiveUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incentive
     */
    select?: IncentiveSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncentiveInclude<ExtArgs> | null
    /**
     * The filter to search for the Incentive to update in case it exists.
     */
    where: IncentiveWhereUniqueInput
    /**
     * In case the Incentive found by the `where` argument doesn't exist, create a new Incentive with this data.
     */
    create: XOR<IncentiveCreateInput, IncentiveUncheckedCreateInput>
    /**
     * In case the Incentive was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IncentiveUpdateInput, IncentiveUncheckedUpdateInput>
  }

  /**
   * Incentive delete
   */
  export type IncentiveDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incentive
     */
    select?: IncentiveSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncentiveInclude<ExtArgs> | null
    /**
     * Filter which Incentive to delete.
     */
    where: IncentiveWhereUniqueInput
  }

  /**
   * Incentive deleteMany
   */
  export type IncentiveDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Incentives to delete
     */
    where?: IncentiveWhereInput
  }

  /**
   * Incentive without action
   */
  export type IncentiveDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incentive
     */
    select?: IncentiveSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncentiveInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password_hash: 'password_hash',
    role: 'role',
    created_at: 'created_at'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const TemplateScalarFieldEnum: {
    id: 'id',
    researcher_id: 'researcher_id',
    title: 'title',
    topic: 'topic',
    starter_questions: 'starter_questions',
    created_at: 'created_at'
  };

  export type TemplateScalarFieldEnum = (typeof TemplateScalarFieldEnum)[keyof typeof TemplateScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    template_id: 'template_id',
    respondent_id: 'respondent_id',
    status: 'status',
    transcript: 'transcript',
    summary: 'summary',
    sentiment_score: 'sentiment_score',
    key_themes: 'key_themes',
    started_at: 'started_at',
    completed_at: 'completed_at',
    duration_seconds: 'duration_seconds'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const RespondentScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    name: 'name',
    demographics: 'demographics',
    participation_count: 'participation_count',
    total_incentives: 'total_incentives',
    avg_sentiment: 'avg_sentiment',
    behavior_tags: 'behavior_tags'
  };

  export type RespondentScalarFieldEnum = (typeof RespondentScalarFieldEnum)[keyof typeof RespondentScalarFieldEnum]


  export const IncentiveScalarFieldEnum: {
    id: 'id',
    respondent_id: 'respondent_id',
    session_id: 'session_id',
    amount: 'amount',
    status: 'status',
    paid_at: 'paid_at'
  };

  export type IncentiveScalarFieldEnum = (typeof IncentiveScalarFieldEnum)[keyof typeof IncentiveScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password_hash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    created_at?: DateTimeFilter<"User"> | Date | string
    templates?: TemplateListRelationFilter
    sessions?: SessionListRelationFilter
    respondent?: XOR<RespondentNullableRelationFilter, RespondentWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    templates?: TemplateOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    respondent?: RespondentOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password_hash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    created_at?: DateTimeFilter<"User"> | Date | string
    templates?: TemplateListRelationFilter
    sessions?: SessionListRelationFilter
    respondent?: XOR<RespondentNullableRelationFilter, RespondentWhereInput> | null
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password_hash?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type TemplateWhereInput = {
    AND?: TemplateWhereInput | TemplateWhereInput[]
    OR?: TemplateWhereInput[]
    NOT?: TemplateWhereInput | TemplateWhereInput[]
    id?: StringFilter<"Template"> | string
    researcher_id?: StringFilter<"Template"> | string
    title?: StringFilter<"Template"> | string
    topic?: StringNullableFilter<"Template"> | string | null
    starter_questions?: JsonFilter<"Template">
    created_at?: DateTimeFilter<"Template"> | Date | string
    researcher?: XOR<UserRelationFilter, UserWhereInput>
    sessions?: SessionListRelationFilter
  }

  export type TemplateOrderByWithRelationInput = {
    id?: SortOrder
    researcher_id?: SortOrder
    title?: SortOrder
    topic?: SortOrderInput | SortOrder
    starter_questions?: SortOrder
    created_at?: SortOrder
    researcher?: UserOrderByWithRelationInput
    sessions?: SessionOrderByRelationAggregateInput
  }

  export type TemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TemplateWhereInput | TemplateWhereInput[]
    OR?: TemplateWhereInput[]
    NOT?: TemplateWhereInput | TemplateWhereInput[]
    researcher_id?: StringFilter<"Template"> | string
    title?: StringFilter<"Template"> | string
    topic?: StringNullableFilter<"Template"> | string | null
    starter_questions?: JsonFilter<"Template">
    created_at?: DateTimeFilter<"Template"> | Date | string
    researcher?: XOR<UserRelationFilter, UserWhereInput>
    sessions?: SessionListRelationFilter
  }, "id">

  export type TemplateOrderByWithAggregationInput = {
    id?: SortOrder
    researcher_id?: SortOrder
    title?: SortOrder
    topic?: SortOrderInput | SortOrder
    starter_questions?: SortOrder
    created_at?: SortOrder
    _count?: TemplateCountOrderByAggregateInput
    _max?: TemplateMaxOrderByAggregateInput
    _min?: TemplateMinOrderByAggregateInput
  }

  export type TemplateScalarWhereWithAggregatesInput = {
    AND?: TemplateScalarWhereWithAggregatesInput | TemplateScalarWhereWithAggregatesInput[]
    OR?: TemplateScalarWhereWithAggregatesInput[]
    NOT?: TemplateScalarWhereWithAggregatesInput | TemplateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Template"> | string
    researcher_id?: StringWithAggregatesFilter<"Template"> | string
    title?: StringWithAggregatesFilter<"Template"> | string
    topic?: StringNullableWithAggregatesFilter<"Template"> | string | null
    starter_questions?: JsonWithAggregatesFilter<"Template">
    created_at?: DateTimeWithAggregatesFilter<"Template"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    template_id?: StringFilter<"Session"> | string
    respondent_id?: StringFilter<"Session"> | string
    status?: StringFilter<"Session"> | string
    transcript?: JsonNullableFilter<"Session">
    summary?: StringNullableFilter<"Session"> | string | null
    sentiment_score?: DecimalNullableFilter<"Session"> | Decimal | DecimalJsLike | number | string | null
    key_themes?: JsonNullableFilter<"Session">
    started_at?: DateTimeNullableFilter<"Session"> | Date | string | null
    completed_at?: DateTimeNullableFilter<"Session"> | Date | string | null
    duration_seconds?: IntNullableFilter<"Session"> | number | null
    template?: XOR<TemplateRelationFilter, TemplateWhereInput>
    respondent?: XOR<UserRelationFilter, UserWhereInput>
    incentives?: IncentiveListRelationFilter
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    template_id?: SortOrder
    respondent_id?: SortOrder
    status?: SortOrder
    transcript?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    sentiment_score?: SortOrderInput | SortOrder
    key_themes?: SortOrderInput | SortOrder
    started_at?: SortOrderInput | SortOrder
    completed_at?: SortOrderInput | SortOrder
    duration_seconds?: SortOrderInput | SortOrder
    template?: TemplateOrderByWithRelationInput
    respondent?: UserOrderByWithRelationInput
    incentives?: IncentiveOrderByRelationAggregateInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    template_id?: StringFilter<"Session"> | string
    respondent_id?: StringFilter<"Session"> | string
    status?: StringFilter<"Session"> | string
    transcript?: JsonNullableFilter<"Session">
    summary?: StringNullableFilter<"Session"> | string | null
    sentiment_score?: DecimalNullableFilter<"Session"> | Decimal | DecimalJsLike | number | string | null
    key_themes?: JsonNullableFilter<"Session">
    started_at?: DateTimeNullableFilter<"Session"> | Date | string | null
    completed_at?: DateTimeNullableFilter<"Session"> | Date | string | null
    duration_seconds?: IntNullableFilter<"Session"> | number | null
    template?: XOR<TemplateRelationFilter, TemplateWhereInput>
    respondent?: XOR<UserRelationFilter, UserWhereInput>
    incentives?: IncentiveListRelationFilter
  }, "id">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    template_id?: SortOrder
    respondent_id?: SortOrder
    status?: SortOrder
    transcript?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    sentiment_score?: SortOrderInput | SortOrder
    key_themes?: SortOrderInput | SortOrder
    started_at?: SortOrderInput | SortOrder
    completed_at?: SortOrderInput | SortOrder
    duration_seconds?: SortOrderInput | SortOrder
    _count?: SessionCountOrderByAggregateInput
    _avg?: SessionAvgOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
    _sum?: SessionSumOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    template_id?: StringWithAggregatesFilter<"Session"> | string
    respondent_id?: StringWithAggregatesFilter<"Session"> | string
    status?: StringWithAggregatesFilter<"Session"> | string
    transcript?: JsonNullableWithAggregatesFilter<"Session">
    summary?: StringNullableWithAggregatesFilter<"Session"> | string | null
    sentiment_score?: DecimalNullableWithAggregatesFilter<"Session"> | Decimal | DecimalJsLike | number | string | null
    key_themes?: JsonNullableWithAggregatesFilter<"Session">
    started_at?: DateTimeNullableWithAggregatesFilter<"Session"> | Date | string | null
    completed_at?: DateTimeNullableWithAggregatesFilter<"Session"> | Date | string | null
    duration_seconds?: IntNullableWithAggregatesFilter<"Session"> | number | null
  }

  export type RespondentWhereInput = {
    AND?: RespondentWhereInput | RespondentWhereInput[]
    OR?: RespondentWhereInput[]
    NOT?: RespondentWhereInput | RespondentWhereInput[]
    id?: StringFilter<"Respondent"> | string
    user_id?: StringFilter<"Respondent"> | string
    name?: StringFilter<"Respondent"> | string
    demographics?: JsonNullableFilter<"Respondent">
    participation_count?: IntFilter<"Respondent"> | number
    total_incentives?: DecimalNullableFilter<"Respondent"> | Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: DecimalNullableFilter<"Respondent"> | Decimal | DecimalJsLike | number | string | null
    behavior_tags?: JsonNullableFilter<"Respondent">
    user?: XOR<UserRelationFilter, UserWhereInput>
    incentives?: IncentiveListRelationFilter
  }

  export type RespondentOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    name?: SortOrder
    demographics?: SortOrderInput | SortOrder
    participation_count?: SortOrder
    total_incentives?: SortOrderInput | SortOrder
    avg_sentiment?: SortOrderInput | SortOrder
    behavior_tags?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    incentives?: IncentiveOrderByRelationAggregateInput
  }

  export type RespondentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    user_id?: string
    AND?: RespondentWhereInput | RespondentWhereInput[]
    OR?: RespondentWhereInput[]
    NOT?: RespondentWhereInput | RespondentWhereInput[]
    name?: StringFilter<"Respondent"> | string
    demographics?: JsonNullableFilter<"Respondent">
    participation_count?: IntFilter<"Respondent"> | number
    total_incentives?: DecimalNullableFilter<"Respondent"> | Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: DecimalNullableFilter<"Respondent"> | Decimal | DecimalJsLike | number | string | null
    behavior_tags?: JsonNullableFilter<"Respondent">
    user?: XOR<UserRelationFilter, UserWhereInput>
    incentives?: IncentiveListRelationFilter
  }, "id" | "user_id">

  export type RespondentOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    name?: SortOrder
    demographics?: SortOrderInput | SortOrder
    participation_count?: SortOrder
    total_incentives?: SortOrderInput | SortOrder
    avg_sentiment?: SortOrderInput | SortOrder
    behavior_tags?: SortOrderInput | SortOrder
    _count?: RespondentCountOrderByAggregateInput
    _avg?: RespondentAvgOrderByAggregateInput
    _max?: RespondentMaxOrderByAggregateInput
    _min?: RespondentMinOrderByAggregateInput
    _sum?: RespondentSumOrderByAggregateInput
  }

  export type RespondentScalarWhereWithAggregatesInput = {
    AND?: RespondentScalarWhereWithAggregatesInput | RespondentScalarWhereWithAggregatesInput[]
    OR?: RespondentScalarWhereWithAggregatesInput[]
    NOT?: RespondentScalarWhereWithAggregatesInput | RespondentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Respondent"> | string
    user_id?: StringWithAggregatesFilter<"Respondent"> | string
    name?: StringWithAggregatesFilter<"Respondent"> | string
    demographics?: JsonNullableWithAggregatesFilter<"Respondent">
    participation_count?: IntWithAggregatesFilter<"Respondent"> | number
    total_incentives?: DecimalNullableWithAggregatesFilter<"Respondent"> | Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: DecimalNullableWithAggregatesFilter<"Respondent"> | Decimal | DecimalJsLike | number | string | null
    behavior_tags?: JsonNullableWithAggregatesFilter<"Respondent">
  }

  export type IncentiveWhereInput = {
    AND?: IncentiveWhereInput | IncentiveWhereInput[]
    OR?: IncentiveWhereInput[]
    NOT?: IncentiveWhereInput | IncentiveWhereInput[]
    id?: StringFilter<"Incentive"> | string
    respondent_id?: StringFilter<"Incentive"> | string
    session_id?: StringFilter<"Incentive"> | string
    amount?: DecimalFilter<"Incentive"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Incentive"> | string
    paid_at?: DateTimeNullableFilter<"Incentive"> | Date | string | null
    respondent?: XOR<RespondentRelationFilter, RespondentWhereInput>
    session?: XOR<SessionRelationFilter, SessionWhereInput>
  }

  export type IncentiveOrderByWithRelationInput = {
    id?: SortOrder
    respondent_id?: SortOrder
    session_id?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paid_at?: SortOrderInput | SortOrder
    respondent?: RespondentOrderByWithRelationInput
    session?: SessionOrderByWithRelationInput
  }

  export type IncentiveWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: IncentiveWhereInput | IncentiveWhereInput[]
    OR?: IncentiveWhereInput[]
    NOT?: IncentiveWhereInput | IncentiveWhereInput[]
    respondent_id?: StringFilter<"Incentive"> | string
    session_id?: StringFilter<"Incentive"> | string
    amount?: DecimalFilter<"Incentive"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Incentive"> | string
    paid_at?: DateTimeNullableFilter<"Incentive"> | Date | string | null
    respondent?: XOR<RespondentRelationFilter, RespondentWhereInput>
    session?: XOR<SessionRelationFilter, SessionWhereInput>
  }, "id">

  export type IncentiveOrderByWithAggregationInput = {
    id?: SortOrder
    respondent_id?: SortOrder
    session_id?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paid_at?: SortOrderInput | SortOrder
    _count?: IncentiveCountOrderByAggregateInput
    _avg?: IncentiveAvgOrderByAggregateInput
    _max?: IncentiveMaxOrderByAggregateInput
    _min?: IncentiveMinOrderByAggregateInput
    _sum?: IncentiveSumOrderByAggregateInput
  }

  export type IncentiveScalarWhereWithAggregatesInput = {
    AND?: IncentiveScalarWhereWithAggregatesInput | IncentiveScalarWhereWithAggregatesInput[]
    OR?: IncentiveScalarWhereWithAggregatesInput[]
    NOT?: IncentiveScalarWhereWithAggregatesInput | IncentiveScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Incentive"> | string
    respondent_id?: StringWithAggregatesFilter<"Incentive"> | string
    session_id?: StringWithAggregatesFilter<"Incentive"> | string
    amount?: DecimalWithAggregatesFilter<"Incentive"> | Decimal | DecimalJsLike | number | string
    status?: StringWithAggregatesFilter<"Incentive"> | string
    paid_at?: DateTimeNullableWithAggregatesFilter<"Incentive"> | Date | string | null
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password_hash: string
    role: string
    created_at?: Date | string
    templates?: TemplateCreateNestedManyWithoutResearcherInput
    sessions?: SessionCreateNestedManyWithoutRespondentInput
    respondent?: RespondentCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password_hash: string
    role: string
    created_at?: Date | string
    templates?: TemplateUncheckedCreateNestedManyWithoutResearcherInput
    sessions?: SessionUncheckedCreateNestedManyWithoutRespondentInput
    respondent?: RespondentUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    templates?: TemplateUpdateManyWithoutResearcherNestedInput
    sessions?: SessionUpdateManyWithoutRespondentNestedInput
    respondent?: RespondentUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    templates?: TemplateUncheckedUpdateManyWithoutResearcherNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutRespondentNestedInput
    respondent?: RespondentUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password_hash: string
    role: string
    created_at?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateCreateInput = {
    id?: string
    title: string
    topic?: string | null
    starter_questions: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    researcher: UserCreateNestedOneWithoutTemplatesInput
    sessions?: SessionCreateNestedManyWithoutTemplateInput
  }

  export type TemplateUncheckedCreateInput = {
    id?: string
    researcher_id: string
    title: string
    topic?: string | null
    starter_questions: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutTemplateInput
  }

  export type TemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    starter_questions?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    researcher?: UserUpdateOneRequiredWithoutTemplatesNestedInput
    sessions?: SessionUpdateManyWithoutTemplateNestedInput
  }

  export type TemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    researcher_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    starter_questions?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutTemplateNestedInput
  }

  export type TemplateCreateManyInput = {
    id?: string
    researcher_id: string
    title: string
    topic?: string | null
    starter_questions: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
  }

  export type TemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    starter_questions?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    researcher_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    starter_questions?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    status: string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: string | null
    sentiment_score?: Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: Date | string | null
    completed_at?: Date | string | null
    duration_seconds?: number | null
    template: TemplateCreateNestedOneWithoutSessionsInput
    respondent: UserCreateNestedOneWithoutSessionsInput
    incentives?: IncentiveCreateNestedManyWithoutSessionInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    template_id: string
    respondent_id: string
    status: string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: string | null
    sentiment_score?: Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: Date | string | null
    completed_at?: Date | string | null
    duration_seconds?: number | null
    incentives?: IncentiveUncheckedCreateNestedManyWithoutSessionInput
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration_seconds?: NullableIntFieldUpdateOperationsInput | number | null
    template?: TemplateUpdateOneRequiredWithoutSessionsNestedInput
    respondent?: UserUpdateOneRequiredWithoutSessionsNestedInput
    incentives?: IncentiveUpdateManyWithoutSessionNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    template_id?: StringFieldUpdateOperationsInput | string
    respondent_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration_seconds?: NullableIntFieldUpdateOperationsInput | number | null
    incentives?: IncentiveUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type SessionCreateManyInput = {
    id?: string
    template_id: string
    respondent_id: string
    status: string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: string | null
    sentiment_score?: Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: Date | string | null
    completed_at?: Date | string | null
    duration_seconds?: number | null
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration_seconds?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    template_id?: StringFieldUpdateOperationsInput | string
    respondent_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration_seconds?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type RespondentCreateInput = {
    id?: string
    name: string
    demographics?: NullableJsonNullValueInput | InputJsonValue
    participation_count?: number
    total_incentives?: Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: Decimal | DecimalJsLike | number | string | null
    behavior_tags?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutRespondentInput
    incentives?: IncentiveCreateNestedManyWithoutRespondentInput
  }

  export type RespondentUncheckedCreateInput = {
    id?: string
    user_id: string
    name: string
    demographics?: NullableJsonNullValueInput | InputJsonValue
    participation_count?: number
    total_incentives?: Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: Decimal | DecimalJsLike | number | string | null
    behavior_tags?: NullableJsonNullValueInput | InputJsonValue
    incentives?: IncentiveUncheckedCreateNestedManyWithoutRespondentInput
  }

  export type RespondentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    demographics?: NullableJsonNullValueInput | InputJsonValue
    participation_count?: IntFieldUpdateOperationsInput | number
    total_incentives?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    behavior_tags?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutRespondentNestedInput
    incentives?: IncentiveUpdateManyWithoutRespondentNestedInput
  }

  export type RespondentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    demographics?: NullableJsonNullValueInput | InputJsonValue
    participation_count?: IntFieldUpdateOperationsInput | number
    total_incentives?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    behavior_tags?: NullableJsonNullValueInput | InputJsonValue
    incentives?: IncentiveUncheckedUpdateManyWithoutRespondentNestedInput
  }

  export type RespondentCreateManyInput = {
    id?: string
    user_id: string
    name: string
    demographics?: NullableJsonNullValueInput | InputJsonValue
    participation_count?: number
    total_incentives?: Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: Decimal | DecimalJsLike | number | string | null
    behavior_tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RespondentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    demographics?: NullableJsonNullValueInput | InputJsonValue
    participation_count?: IntFieldUpdateOperationsInput | number
    total_incentives?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    behavior_tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RespondentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    demographics?: NullableJsonNullValueInput | InputJsonValue
    participation_count?: IntFieldUpdateOperationsInput | number
    total_incentives?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    behavior_tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type IncentiveCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    status: string
    paid_at?: Date | string | null
    respondent: RespondentCreateNestedOneWithoutIncentivesInput
    session: SessionCreateNestedOneWithoutIncentivesInput
  }

  export type IncentiveUncheckedCreateInput = {
    id?: string
    respondent_id: string
    session_id: string
    amount: Decimal | DecimalJsLike | number | string
    status: string
    paid_at?: Date | string | null
  }

  export type IncentiveUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    paid_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    respondent?: RespondentUpdateOneRequiredWithoutIncentivesNestedInput
    session?: SessionUpdateOneRequiredWithoutIncentivesNestedInput
  }

  export type IncentiveUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    respondent_id?: StringFieldUpdateOperationsInput | string
    session_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    paid_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IncentiveCreateManyInput = {
    id?: string
    respondent_id: string
    session_id: string
    amount: Decimal | DecimalJsLike | number | string
    status: string
    paid_at?: Date | string | null
  }

  export type IncentiveUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    paid_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IncentiveUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    respondent_id?: StringFieldUpdateOperationsInput | string
    session_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    paid_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TemplateListRelationFilter = {
    every?: TemplateWhereInput
    some?: TemplateWhereInput
    none?: TemplateWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type RespondentNullableRelationFilter = {
    is?: RespondentWhereInput | null
    isNot?: RespondentWhereInput | null
  }

  export type TemplateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TemplateCountOrderByAggregateInput = {
    id?: SortOrder
    researcher_id?: SortOrder
    title?: SortOrder
    topic?: SortOrder
    starter_questions?: SortOrder
    created_at?: SortOrder
  }

  export type TemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    researcher_id?: SortOrder
    title?: SortOrder
    topic?: SortOrder
    created_at?: SortOrder
  }

  export type TemplateMinOrderByAggregateInput = {
    id?: SortOrder
    researcher_id?: SortOrder
    title?: SortOrder
    topic?: SortOrder
    created_at?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type TemplateRelationFilter = {
    is?: TemplateWhereInput
    isNot?: TemplateWhereInput
  }

  export type IncentiveListRelationFilter = {
    every?: IncentiveWhereInput
    some?: IncentiveWhereInput
    none?: IncentiveWhereInput
  }

  export type IncentiveOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    template_id?: SortOrder
    respondent_id?: SortOrder
    status?: SortOrder
    transcript?: SortOrder
    summary?: SortOrder
    sentiment_score?: SortOrder
    key_themes?: SortOrder
    started_at?: SortOrder
    completed_at?: SortOrder
    duration_seconds?: SortOrder
  }

  export type SessionAvgOrderByAggregateInput = {
    sentiment_score?: SortOrder
    duration_seconds?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    template_id?: SortOrder
    respondent_id?: SortOrder
    status?: SortOrder
    summary?: SortOrder
    sentiment_score?: SortOrder
    started_at?: SortOrder
    completed_at?: SortOrder
    duration_seconds?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    template_id?: SortOrder
    respondent_id?: SortOrder
    status?: SortOrder
    summary?: SortOrder
    sentiment_score?: SortOrder
    started_at?: SortOrder
    completed_at?: SortOrder
    duration_seconds?: SortOrder
  }

  export type SessionSumOrderByAggregateInput = {
    sentiment_score?: SortOrder
    duration_seconds?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type RespondentCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    name?: SortOrder
    demographics?: SortOrder
    participation_count?: SortOrder
    total_incentives?: SortOrder
    avg_sentiment?: SortOrder
    behavior_tags?: SortOrder
  }

  export type RespondentAvgOrderByAggregateInput = {
    participation_count?: SortOrder
    total_incentives?: SortOrder
    avg_sentiment?: SortOrder
  }

  export type RespondentMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    name?: SortOrder
    participation_count?: SortOrder
    total_incentives?: SortOrder
    avg_sentiment?: SortOrder
  }

  export type RespondentMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    name?: SortOrder
    participation_count?: SortOrder
    total_incentives?: SortOrder
    avg_sentiment?: SortOrder
  }

  export type RespondentSumOrderByAggregateInput = {
    participation_count?: SortOrder
    total_incentives?: SortOrder
    avg_sentiment?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type RespondentRelationFilter = {
    is?: RespondentWhereInput
    isNot?: RespondentWhereInput
  }

  export type SessionRelationFilter = {
    is?: SessionWhereInput
    isNot?: SessionWhereInput
  }

  export type IncentiveCountOrderByAggregateInput = {
    id?: SortOrder
    respondent_id?: SortOrder
    session_id?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paid_at?: SortOrder
  }

  export type IncentiveAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type IncentiveMaxOrderByAggregateInput = {
    id?: SortOrder
    respondent_id?: SortOrder
    session_id?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paid_at?: SortOrder
  }

  export type IncentiveMinOrderByAggregateInput = {
    id?: SortOrder
    respondent_id?: SortOrder
    session_id?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paid_at?: SortOrder
  }

  export type IncentiveSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type TemplateCreateNestedManyWithoutResearcherInput = {
    create?: XOR<TemplateCreateWithoutResearcherInput, TemplateUncheckedCreateWithoutResearcherInput> | TemplateCreateWithoutResearcherInput[] | TemplateUncheckedCreateWithoutResearcherInput[]
    connectOrCreate?: TemplateCreateOrConnectWithoutResearcherInput | TemplateCreateOrConnectWithoutResearcherInput[]
    createMany?: TemplateCreateManyResearcherInputEnvelope
    connect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutRespondentInput = {
    create?: XOR<SessionCreateWithoutRespondentInput, SessionUncheckedCreateWithoutRespondentInput> | SessionCreateWithoutRespondentInput[] | SessionUncheckedCreateWithoutRespondentInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutRespondentInput | SessionCreateOrConnectWithoutRespondentInput[]
    createMany?: SessionCreateManyRespondentInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type RespondentCreateNestedOneWithoutUserInput = {
    create?: XOR<RespondentCreateWithoutUserInput, RespondentUncheckedCreateWithoutUserInput>
    connectOrCreate?: RespondentCreateOrConnectWithoutUserInput
    connect?: RespondentWhereUniqueInput
  }

  export type TemplateUncheckedCreateNestedManyWithoutResearcherInput = {
    create?: XOR<TemplateCreateWithoutResearcherInput, TemplateUncheckedCreateWithoutResearcherInput> | TemplateCreateWithoutResearcherInput[] | TemplateUncheckedCreateWithoutResearcherInput[]
    connectOrCreate?: TemplateCreateOrConnectWithoutResearcherInput | TemplateCreateOrConnectWithoutResearcherInput[]
    createMany?: TemplateCreateManyResearcherInputEnvelope
    connect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutRespondentInput = {
    create?: XOR<SessionCreateWithoutRespondentInput, SessionUncheckedCreateWithoutRespondentInput> | SessionCreateWithoutRespondentInput[] | SessionUncheckedCreateWithoutRespondentInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutRespondentInput | SessionCreateOrConnectWithoutRespondentInput[]
    createMany?: SessionCreateManyRespondentInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type RespondentUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<RespondentCreateWithoutUserInput, RespondentUncheckedCreateWithoutUserInput>
    connectOrCreate?: RespondentCreateOrConnectWithoutUserInput
    connect?: RespondentWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TemplateUpdateManyWithoutResearcherNestedInput = {
    create?: XOR<TemplateCreateWithoutResearcherInput, TemplateUncheckedCreateWithoutResearcherInput> | TemplateCreateWithoutResearcherInput[] | TemplateUncheckedCreateWithoutResearcherInput[]
    connectOrCreate?: TemplateCreateOrConnectWithoutResearcherInput | TemplateCreateOrConnectWithoutResearcherInput[]
    upsert?: TemplateUpsertWithWhereUniqueWithoutResearcherInput | TemplateUpsertWithWhereUniqueWithoutResearcherInput[]
    createMany?: TemplateCreateManyResearcherInputEnvelope
    set?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    disconnect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    delete?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    connect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    update?: TemplateUpdateWithWhereUniqueWithoutResearcherInput | TemplateUpdateWithWhereUniqueWithoutResearcherInput[]
    updateMany?: TemplateUpdateManyWithWhereWithoutResearcherInput | TemplateUpdateManyWithWhereWithoutResearcherInput[]
    deleteMany?: TemplateScalarWhereInput | TemplateScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutRespondentNestedInput = {
    create?: XOR<SessionCreateWithoutRespondentInput, SessionUncheckedCreateWithoutRespondentInput> | SessionCreateWithoutRespondentInput[] | SessionUncheckedCreateWithoutRespondentInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutRespondentInput | SessionCreateOrConnectWithoutRespondentInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutRespondentInput | SessionUpsertWithWhereUniqueWithoutRespondentInput[]
    createMany?: SessionCreateManyRespondentInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutRespondentInput | SessionUpdateWithWhereUniqueWithoutRespondentInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutRespondentInput | SessionUpdateManyWithWhereWithoutRespondentInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type RespondentUpdateOneWithoutUserNestedInput = {
    create?: XOR<RespondentCreateWithoutUserInput, RespondentUncheckedCreateWithoutUserInput>
    connectOrCreate?: RespondentCreateOrConnectWithoutUserInput
    upsert?: RespondentUpsertWithoutUserInput
    disconnect?: RespondentWhereInput | boolean
    delete?: RespondentWhereInput | boolean
    connect?: RespondentWhereUniqueInput
    update?: XOR<XOR<RespondentUpdateToOneWithWhereWithoutUserInput, RespondentUpdateWithoutUserInput>, RespondentUncheckedUpdateWithoutUserInput>
  }

  export type TemplateUncheckedUpdateManyWithoutResearcherNestedInput = {
    create?: XOR<TemplateCreateWithoutResearcherInput, TemplateUncheckedCreateWithoutResearcherInput> | TemplateCreateWithoutResearcherInput[] | TemplateUncheckedCreateWithoutResearcherInput[]
    connectOrCreate?: TemplateCreateOrConnectWithoutResearcherInput | TemplateCreateOrConnectWithoutResearcherInput[]
    upsert?: TemplateUpsertWithWhereUniqueWithoutResearcherInput | TemplateUpsertWithWhereUniqueWithoutResearcherInput[]
    createMany?: TemplateCreateManyResearcherInputEnvelope
    set?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    disconnect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    delete?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    connect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    update?: TemplateUpdateWithWhereUniqueWithoutResearcherInput | TemplateUpdateWithWhereUniqueWithoutResearcherInput[]
    updateMany?: TemplateUpdateManyWithWhereWithoutResearcherInput | TemplateUpdateManyWithWhereWithoutResearcherInput[]
    deleteMany?: TemplateScalarWhereInput | TemplateScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutRespondentNestedInput = {
    create?: XOR<SessionCreateWithoutRespondentInput, SessionUncheckedCreateWithoutRespondentInput> | SessionCreateWithoutRespondentInput[] | SessionUncheckedCreateWithoutRespondentInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutRespondentInput | SessionCreateOrConnectWithoutRespondentInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutRespondentInput | SessionUpsertWithWhereUniqueWithoutRespondentInput[]
    createMany?: SessionCreateManyRespondentInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutRespondentInput | SessionUpdateWithWhereUniqueWithoutRespondentInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutRespondentInput | SessionUpdateManyWithWhereWithoutRespondentInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type RespondentUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<RespondentCreateWithoutUserInput, RespondentUncheckedCreateWithoutUserInput>
    connectOrCreate?: RespondentCreateOrConnectWithoutUserInput
    upsert?: RespondentUpsertWithoutUserInput
    disconnect?: RespondentWhereInput | boolean
    delete?: RespondentWhereInput | boolean
    connect?: RespondentWhereUniqueInput
    update?: XOR<XOR<RespondentUpdateToOneWithWhereWithoutUserInput, RespondentUpdateWithoutUserInput>, RespondentUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutTemplatesInput = {
    create?: XOR<UserCreateWithoutTemplatesInput, UserUncheckedCreateWithoutTemplatesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTemplatesInput
    connect?: UserWhereUniqueInput
  }

  export type SessionCreateNestedManyWithoutTemplateInput = {
    create?: XOR<SessionCreateWithoutTemplateInput, SessionUncheckedCreateWithoutTemplateInput> | SessionCreateWithoutTemplateInput[] | SessionUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutTemplateInput | SessionCreateOrConnectWithoutTemplateInput[]
    createMany?: SessionCreateManyTemplateInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutTemplateInput = {
    create?: XOR<SessionCreateWithoutTemplateInput, SessionUncheckedCreateWithoutTemplateInput> | SessionCreateWithoutTemplateInput[] | SessionUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutTemplateInput | SessionCreateOrConnectWithoutTemplateInput[]
    createMany?: SessionCreateManyTemplateInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateOneRequiredWithoutTemplatesNestedInput = {
    create?: XOR<UserCreateWithoutTemplatesInput, UserUncheckedCreateWithoutTemplatesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTemplatesInput
    upsert?: UserUpsertWithoutTemplatesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTemplatesInput, UserUpdateWithoutTemplatesInput>, UserUncheckedUpdateWithoutTemplatesInput>
  }

  export type SessionUpdateManyWithoutTemplateNestedInput = {
    create?: XOR<SessionCreateWithoutTemplateInput, SessionUncheckedCreateWithoutTemplateInput> | SessionCreateWithoutTemplateInput[] | SessionUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutTemplateInput | SessionCreateOrConnectWithoutTemplateInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutTemplateInput | SessionUpsertWithWhereUniqueWithoutTemplateInput[]
    createMany?: SessionCreateManyTemplateInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutTemplateInput | SessionUpdateWithWhereUniqueWithoutTemplateInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutTemplateInput | SessionUpdateManyWithWhereWithoutTemplateInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutTemplateNestedInput = {
    create?: XOR<SessionCreateWithoutTemplateInput, SessionUncheckedCreateWithoutTemplateInput> | SessionCreateWithoutTemplateInput[] | SessionUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutTemplateInput | SessionCreateOrConnectWithoutTemplateInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutTemplateInput | SessionUpsertWithWhereUniqueWithoutTemplateInput[]
    createMany?: SessionCreateManyTemplateInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutTemplateInput | SessionUpdateWithWhereUniqueWithoutTemplateInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutTemplateInput | SessionUpdateManyWithWhereWithoutTemplateInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type TemplateCreateNestedOneWithoutSessionsInput = {
    create?: XOR<TemplateCreateWithoutSessionsInput, TemplateUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: TemplateCreateOrConnectWithoutSessionsInput
    connect?: TemplateWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type IncentiveCreateNestedManyWithoutSessionInput = {
    create?: XOR<IncentiveCreateWithoutSessionInput, IncentiveUncheckedCreateWithoutSessionInput> | IncentiveCreateWithoutSessionInput[] | IncentiveUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: IncentiveCreateOrConnectWithoutSessionInput | IncentiveCreateOrConnectWithoutSessionInput[]
    createMany?: IncentiveCreateManySessionInputEnvelope
    connect?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
  }

  export type IncentiveUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<IncentiveCreateWithoutSessionInput, IncentiveUncheckedCreateWithoutSessionInput> | IncentiveCreateWithoutSessionInput[] | IncentiveUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: IncentiveCreateOrConnectWithoutSessionInput | IncentiveCreateOrConnectWithoutSessionInput[]
    createMany?: IncentiveCreateManySessionInputEnvelope
    connect?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TemplateUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<TemplateCreateWithoutSessionsInput, TemplateUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: TemplateCreateOrConnectWithoutSessionsInput
    upsert?: TemplateUpsertWithoutSessionsInput
    connect?: TemplateWhereUniqueInput
    update?: XOR<XOR<TemplateUpdateToOneWithWhereWithoutSessionsInput, TemplateUpdateWithoutSessionsInput>, TemplateUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type IncentiveUpdateManyWithoutSessionNestedInput = {
    create?: XOR<IncentiveCreateWithoutSessionInput, IncentiveUncheckedCreateWithoutSessionInput> | IncentiveCreateWithoutSessionInput[] | IncentiveUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: IncentiveCreateOrConnectWithoutSessionInput | IncentiveCreateOrConnectWithoutSessionInput[]
    upsert?: IncentiveUpsertWithWhereUniqueWithoutSessionInput | IncentiveUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: IncentiveCreateManySessionInputEnvelope
    set?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
    disconnect?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
    delete?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
    connect?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
    update?: IncentiveUpdateWithWhereUniqueWithoutSessionInput | IncentiveUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: IncentiveUpdateManyWithWhereWithoutSessionInput | IncentiveUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: IncentiveScalarWhereInput | IncentiveScalarWhereInput[]
  }

  export type IncentiveUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<IncentiveCreateWithoutSessionInput, IncentiveUncheckedCreateWithoutSessionInput> | IncentiveCreateWithoutSessionInput[] | IncentiveUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: IncentiveCreateOrConnectWithoutSessionInput | IncentiveCreateOrConnectWithoutSessionInput[]
    upsert?: IncentiveUpsertWithWhereUniqueWithoutSessionInput | IncentiveUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: IncentiveCreateManySessionInputEnvelope
    set?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
    disconnect?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
    delete?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
    connect?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
    update?: IncentiveUpdateWithWhereUniqueWithoutSessionInput | IncentiveUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: IncentiveUpdateManyWithWhereWithoutSessionInput | IncentiveUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: IncentiveScalarWhereInput | IncentiveScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRespondentInput = {
    create?: XOR<UserCreateWithoutRespondentInput, UserUncheckedCreateWithoutRespondentInput>
    connectOrCreate?: UserCreateOrConnectWithoutRespondentInput
    connect?: UserWhereUniqueInput
  }

  export type IncentiveCreateNestedManyWithoutRespondentInput = {
    create?: XOR<IncentiveCreateWithoutRespondentInput, IncentiveUncheckedCreateWithoutRespondentInput> | IncentiveCreateWithoutRespondentInput[] | IncentiveUncheckedCreateWithoutRespondentInput[]
    connectOrCreate?: IncentiveCreateOrConnectWithoutRespondentInput | IncentiveCreateOrConnectWithoutRespondentInput[]
    createMany?: IncentiveCreateManyRespondentInputEnvelope
    connect?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
  }

  export type IncentiveUncheckedCreateNestedManyWithoutRespondentInput = {
    create?: XOR<IncentiveCreateWithoutRespondentInput, IncentiveUncheckedCreateWithoutRespondentInput> | IncentiveCreateWithoutRespondentInput[] | IncentiveUncheckedCreateWithoutRespondentInput[]
    connectOrCreate?: IncentiveCreateOrConnectWithoutRespondentInput | IncentiveCreateOrConnectWithoutRespondentInput[]
    createMany?: IncentiveCreateManyRespondentInputEnvelope
    connect?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutRespondentNestedInput = {
    create?: XOR<UserCreateWithoutRespondentInput, UserUncheckedCreateWithoutRespondentInput>
    connectOrCreate?: UserCreateOrConnectWithoutRespondentInput
    upsert?: UserUpsertWithoutRespondentInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRespondentInput, UserUpdateWithoutRespondentInput>, UserUncheckedUpdateWithoutRespondentInput>
  }

  export type IncentiveUpdateManyWithoutRespondentNestedInput = {
    create?: XOR<IncentiveCreateWithoutRespondentInput, IncentiveUncheckedCreateWithoutRespondentInput> | IncentiveCreateWithoutRespondentInput[] | IncentiveUncheckedCreateWithoutRespondentInput[]
    connectOrCreate?: IncentiveCreateOrConnectWithoutRespondentInput | IncentiveCreateOrConnectWithoutRespondentInput[]
    upsert?: IncentiveUpsertWithWhereUniqueWithoutRespondentInput | IncentiveUpsertWithWhereUniqueWithoutRespondentInput[]
    createMany?: IncentiveCreateManyRespondentInputEnvelope
    set?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
    disconnect?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
    delete?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
    connect?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
    update?: IncentiveUpdateWithWhereUniqueWithoutRespondentInput | IncentiveUpdateWithWhereUniqueWithoutRespondentInput[]
    updateMany?: IncentiveUpdateManyWithWhereWithoutRespondentInput | IncentiveUpdateManyWithWhereWithoutRespondentInput[]
    deleteMany?: IncentiveScalarWhereInput | IncentiveScalarWhereInput[]
  }

  export type IncentiveUncheckedUpdateManyWithoutRespondentNestedInput = {
    create?: XOR<IncentiveCreateWithoutRespondentInput, IncentiveUncheckedCreateWithoutRespondentInput> | IncentiveCreateWithoutRespondentInput[] | IncentiveUncheckedCreateWithoutRespondentInput[]
    connectOrCreate?: IncentiveCreateOrConnectWithoutRespondentInput | IncentiveCreateOrConnectWithoutRespondentInput[]
    upsert?: IncentiveUpsertWithWhereUniqueWithoutRespondentInput | IncentiveUpsertWithWhereUniqueWithoutRespondentInput[]
    createMany?: IncentiveCreateManyRespondentInputEnvelope
    set?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
    disconnect?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
    delete?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
    connect?: IncentiveWhereUniqueInput | IncentiveWhereUniqueInput[]
    update?: IncentiveUpdateWithWhereUniqueWithoutRespondentInput | IncentiveUpdateWithWhereUniqueWithoutRespondentInput[]
    updateMany?: IncentiveUpdateManyWithWhereWithoutRespondentInput | IncentiveUpdateManyWithWhereWithoutRespondentInput[]
    deleteMany?: IncentiveScalarWhereInput | IncentiveScalarWhereInput[]
  }

  export type RespondentCreateNestedOneWithoutIncentivesInput = {
    create?: XOR<RespondentCreateWithoutIncentivesInput, RespondentUncheckedCreateWithoutIncentivesInput>
    connectOrCreate?: RespondentCreateOrConnectWithoutIncentivesInput
    connect?: RespondentWhereUniqueInput
  }

  export type SessionCreateNestedOneWithoutIncentivesInput = {
    create?: XOR<SessionCreateWithoutIncentivesInput, SessionUncheckedCreateWithoutIncentivesInput>
    connectOrCreate?: SessionCreateOrConnectWithoutIncentivesInput
    connect?: SessionWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type RespondentUpdateOneRequiredWithoutIncentivesNestedInput = {
    create?: XOR<RespondentCreateWithoutIncentivesInput, RespondentUncheckedCreateWithoutIncentivesInput>
    connectOrCreate?: RespondentCreateOrConnectWithoutIncentivesInput
    upsert?: RespondentUpsertWithoutIncentivesInput
    connect?: RespondentWhereUniqueInput
    update?: XOR<XOR<RespondentUpdateToOneWithWhereWithoutIncentivesInput, RespondentUpdateWithoutIncentivesInput>, RespondentUncheckedUpdateWithoutIncentivesInput>
  }

  export type SessionUpdateOneRequiredWithoutIncentivesNestedInput = {
    create?: XOR<SessionCreateWithoutIncentivesInput, SessionUncheckedCreateWithoutIncentivesInput>
    connectOrCreate?: SessionCreateOrConnectWithoutIncentivesInput
    upsert?: SessionUpsertWithoutIncentivesInput
    connect?: SessionWhereUniqueInput
    update?: XOR<XOR<SessionUpdateToOneWithWhereWithoutIncentivesInput, SessionUpdateWithoutIncentivesInput>, SessionUncheckedUpdateWithoutIncentivesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type TemplateCreateWithoutResearcherInput = {
    id?: string
    title: string
    topic?: string | null
    starter_questions: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    sessions?: SessionCreateNestedManyWithoutTemplateInput
  }

  export type TemplateUncheckedCreateWithoutResearcherInput = {
    id?: string
    title: string
    topic?: string | null
    starter_questions: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutTemplateInput
  }

  export type TemplateCreateOrConnectWithoutResearcherInput = {
    where: TemplateWhereUniqueInput
    create: XOR<TemplateCreateWithoutResearcherInput, TemplateUncheckedCreateWithoutResearcherInput>
  }

  export type TemplateCreateManyResearcherInputEnvelope = {
    data: TemplateCreateManyResearcherInput | TemplateCreateManyResearcherInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutRespondentInput = {
    id?: string
    status: string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: string | null
    sentiment_score?: Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: Date | string | null
    completed_at?: Date | string | null
    duration_seconds?: number | null
    template: TemplateCreateNestedOneWithoutSessionsInput
    incentives?: IncentiveCreateNestedManyWithoutSessionInput
  }

  export type SessionUncheckedCreateWithoutRespondentInput = {
    id?: string
    template_id: string
    status: string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: string | null
    sentiment_score?: Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: Date | string | null
    completed_at?: Date | string | null
    duration_seconds?: number | null
    incentives?: IncentiveUncheckedCreateNestedManyWithoutSessionInput
  }

  export type SessionCreateOrConnectWithoutRespondentInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutRespondentInput, SessionUncheckedCreateWithoutRespondentInput>
  }

  export type SessionCreateManyRespondentInputEnvelope = {
    data: SessionCreateManyRespondentInput | SessionCreateManyRespondentInput[]
    skipDuplicates?: boolean
  }

  export type RespondentCreateWithoutUserInput = {
    id?: string
    name: string
    demographics?: NullableJsonNullValueInput | InputJsonValue
    participation_count?: number
    total_incentives?: Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: Decimal | DecimalJsLike | number | string | null
    behavior_tags?: NullableJsonNullValueInput | InputJsonValue
    incentives?: IncentiveCreateNestedManyWithoutRespondentInput
  }

  export type RespondentUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    demographics?: NullableJsonNullValueInput | InputJsonValue
    participation_count?: number
    total_incentives?: Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: Decimal | DecimalJsLike | number | string | null
    behavior_tags?: NullableJsonNullValueInput | InputJsonValue
    incentives?: IncentiveUncheckedCreateNestedManyWithoutRespondentInput
  }

  export type RespondentCreateOrConnectWithoutUserInput = {
    where: RespondentWhereUniqueInput
    create: XOR<RespondentCreateWithoutUserInput, RespondentUncheckedCreateWithoutUserInput>
  }

  export type TemplateUpsertWithWhereUniqueWithoutResearcherInput = {
    where: TemplateWhereUniqueInput
    update: XOR<TemplateUpdateWithoutResearcherInput, TemplateUncheckedUpdateWithoutResearcherInput>
    create: XOR<TemplateCreateWithoutResearcherInput, TemplateUncheckedCreateWithoutResearcherInput>
  }

  export type TemplateUpdateWithWhereUniqueWithoutResearcherInput = {
    where: TemplateWhereUniqueInput
    data: XOR<TemplateUpdateWithoutResearcherInput, TemplateUncheckedUpdateWithoutResearcherInput>
  }

  export type TemplateUpdateManyWithWhereWithoutResearcherInput = {
    where: TemplateScalarWhereInput
    data: XOR<TemplateUpdateManyMutationInput, TemplateUncheckedUpdateManyWithoutResearcherInput>
  }

  export type TemplateScalarWhereInput = {
    AND?: TemplateScalarWhereInput | TemplateScalarWhereInput[]
    OR?: TemplateScalarWhereInput[]
    NOT?: TemplateScalarWhereInput | TemplateScalarWhereInput[]
    id?: StringFilter<"Template"> | string
    researcher_id?: StringFilter<"Template"> | string
    title?: StringFilter<"Template"> | string
    topic?: StringNullableFilter<"Template"> | string | null
    starter_questions?: JsonFilter<"Template">
    created_at?: DateTimeFilter<"Template"> | Date | string
  }

  export type SessionUpsertWithWhereUniqueWithoutRespondentInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutRespondentInput, SessionUncheckedUpdateWithoutRespondentInput>
    create: XOR<SessionCreateWithoutRespondentInput, SessionUncheckedCreateWithoutRespondentInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutRespondentInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutRespondentInput, SessionUncheckedUpdateWithoutRespondentInput>
  }

  export type SessionUpdateManyWithWhereWithoutRespondentInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutRespondentInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    template_id?: StringFilter<"Session"> | string
    respondent_id?: StringFilter<"Session"> | string
    status?: StringFilter<"Session"> | string
    transcript?: JsonNullableFilter<"Session">
    summary?: StringNullableFilter<"Session"> | string | null
    sentiment_score?: DecimalNullableFilter<"Session"> | Decimal | DecimalJsLike | number | string | null
    key_themes?: JsonNullableFilter<"Session">
    started_at?: DateTimeNullableFilter<"Session"> | Date | string | null
    completed_at?: DateTimeNullableFilter<"Session"> | Date | string | null
    duration_seconds?: IntNullableFilter<"Session"> | number | null
  }

  export type RespondentUpsertWithoutUserInput = {
    update: XOR<RespondentUpdateWithoutUserInput, RespondentUncheckedUpdateWithoutUserInput>
    create: XOR<RespondentCreateWithoutUserInput, RespondentUncheckedCreateWithoutUserInput>
    where?: RespondentWhereInput
  }

  export type RespondentUpdateToOneWithWhereWithoutUserInput = {
    where?: RespondentWhereInput
    data: XOR<RespondentUpdateWithoutUserInput, RespondentUncheckedUpdateWithoutUserInput>
  }

  export type RespondentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    demographics?: NullableJsonNullValueInput | InputJsonValue
    participation_count?: IntFieldUpdateOperationsInput | number
    total_incentives?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    behavior_tags?: NullableJsonNullValueInput | InputJsonValue
    incentives?: IncentiveUpdateManyWithoutRespondentNestedInput
  }

  export type RespondentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    demographics?: NullableJsonNullValueInput | InputJsonValue
    participation_count?: IntFieldUpdateOperationsInput | number
    total_incentives?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    behavior_tags?: NullableJsonNullValueInput | InputJsonValue
    incentives?: IncentiveUncheckedUpdateManyWithoutRespondentNestedInput
  }

  export type UserCreateWithoutTemplatesInput = {
    id?: string
    email: string
    password_hash: string
    role: string
    created_at?: Date | string
    sessions?: SessionCreateNestedManyWithoutRespondentInput
    respondent?: RespondentCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTemplatesInput = {
    id?: string
    email: string
    password_hash: string
    role: string
    created_at?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutRespondentInput
    respondent?: RespondentUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTemplatesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTemplatesInput, UserUncheckedCreateWithoutTemplatesInput>
  }

  export type SessionCreateWithoutTemplateInput = {
    id?: string
    status: string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: string | null
    sentiment_score?: Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: Date | string | null
    completed_at?: Date | string | null
    duration_seconds?: number | null
    respondent: UserCreateNestedOneWithoutSessionsInput
    incentives?: IncentiveCreateNestedManyWithoutSessionInput
  }

  export type SessionUncheckedCreateWithoutTemplateInput = {
    id?: string
    respondent_id: string
    status: string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: string | null
    sentiment_score?: Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: Date | string | null
    completed_at?: Date | string | null
    duration_seconds?: number | null
    incentives?: IncentiveUncheckedCreateNestedManyWithoutSessionInput
  }

  export type SessionCreateOrConnectWithoutTemplateInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutTemplateInput, SessionUncheckedCreateWithoutTemplateInput>
  }

  export type SessionCreateManyTemplateInputEnvelope = {
    data: SessionCreateManyTemplateInput | SessionCreateManyTemplateInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutTemplatesInput = {
    update: XOR<UserUpdateWithoutTemplatesInput, UserUncheckedUpdateWithoutTemplatesInput>
    create: XOR<UserCreateWithoutTemplatesInput, UserUncheckedCreateWithoutTemplatesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTemplatesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTemplatesInput, UserUncheckedUpdateWithoutTemplatesInput>
  }

  export type UserUpdateWithoutTemplatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutRespondentNestedInput
    respondent?: RespondentUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTemplatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutRespondentNestedInput
    respondent?: RespondentUncheckedUpdateOneWithoutUserNestedInput
  }

  export type SessionUpsertWithWhereUniqueWithoutTemplateInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutTemplateInput, SessionUncheckedUpdateWithoutTemplateInput>
    create: XOR<SessionCreateWithoutTemplateInput, SessionUncheckedCreateWithoutTemplateInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutTemplateInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutTemplateInput, SessionUncheckedUpdateWithoutTemplateInput>
  }

  export type SessionUpdateManyWithWhereWithoutTemplateInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutTemplateInput>
  }

  export type TemplateCreateWithoutSessionsInput = {
    id?: string
    title: string
    topic?: string | null
    starter_questions: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    researcher: UserCreateNestedOneWithoutTemplatesInput
  }

  export type TemplateUncheckedCreateWithoutSessionsInput = {
    id?: string
    researcher_id: string
    title: string
    topic?: string | null
    starter_questions: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
  }

  export type TemplateCreateOrConnectWithoutSessionsInput = {
    where: TemplateWhereUniqueInput
    create: XOR<TemplateCreateWithoutSessionsInput, TemplateUncheckedCreateWithoutSessionsInput>
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email: string
    password_hash: string
    role: string
    created_at?: Date | string
    templates?: TemplateCreateNestedManyWithoutResearcherInput
    respondent?: RespondentCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    password_hash: string
    role: string
    created_at?: Date | string
    templates?: TemplateUncheckedCreateNestedManyWithoutResearcherInput
    respondent?: RespondentUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type IncentiveCreateWithoutSessionInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    status: string
    paid_at?: Date | string | null
    respondent: RespondentCreateNestedOneWithoutIncentivesInput
  }

  export type IncentiveUncheckedCreateWithoutSessionInput = {
    id?: string
    respondent_id: string
    amount: Decimal | DecimalJsLike | number | string
    status: string
    paid_at?: Date | string | null
  }

  export type IncentiveCreateOrConnectWithoutSessionInput = {
    where: IncentiveWhereUniqueInput
    create: XOR<IncentiveCreateWithoutSessionInput, IncentiveUncheckedCreateWithoutSessionInput>
  }

  export type IncentiveCreateManySessionInputEnvelope = {
    data: IncentiveCreateManySessionInput | IncentiveCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type TemplateUpsertWithoutSessionsInput = {
    update: XOR<TemplateUpdateWithoutSessionsInput, TemplateUncheckedUpdateWithoutSessionsInput>
    create: XOR<TemplateCreateWithoutSessionsInput, TemplateUncheckedCreateWithoutSessionsInput>
    where?: TemplateWhereInput
  }

  export type TemplateUpdateToOneWithWhereWithoutSessionsInput = {
    where?: TemplateWhereInput
    data: XOR<TemplateUpdateWithoutSessionsInput, TemplateUncheckedUpdateWithoutSessionsInput>
  }

  export type TemplateUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    starter_questions?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    researcher?: UserUpdateOneRequiredWithoutTemplatesNestedInput
  }

  export type TemplateUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    researcher_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    starter_questions?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    templates?: TemplateUpdateManyWithoutResearcherNestedInput
    respondent?: RespondentUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    templates?: TemplateUncheckedUpdateManyWithoutResearcherNestedInput
    respondent?: RespondentUncheckedUpdateOneWithoutUserNestedInput
  }

  export type IncentiveUpsertWithWhereUniqueWithoutSessionInput = {
    where: IncentiveWhereUniqueInput
    update: XOR<IncentiveUpdateWithoutSessionInput, IncentiveUncheckedUpdateWithoutSessionInput>
    create: XOR<IncentiveCreateWithoutSessionInput, IncentiveUncheckedCreateWithoutSessionInput>
  }

  export type IncentiveUpdateWithWhereUniqueWithoutSessionInput = {
    where: IncentiveWhereUniqueInput
    data: XOR<IncentiveUpdateWithoutSessionInput, IncentiveUncheckedUpdateWithoutSessionInput>
  }

  export type IncentiveUpdateManyWithWhereWithoutSessionInput = {
    where: IncentiveScalarWhereInput
    data: XOR<IncentiveUpdateManyMutationInput, IncentiveUncheckedUpdateManyWithoutSessionInput>
  }

  export type IncentiveScalarWhereInput = {
    AND?: IncentiveScalarWhereInput | IncentiveScalarWhereInput[]
    OR?: IncentiveScalarWhereInput[]
    NOT?: IncentiveScalarWhereInput | IncentiveScalarWhereInput[]
    id?: StringFilter<"Incentive"> | string
    respondent_id?: StringFilter<"Incentive"> | string
    session_id?: StringFilter<"Incentive"> | string
    amount?: DecimalFilter<"Incentive"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Incentive"> | string
    paid_at?: DateTimeNullableFilter<"Incentive"> | Date | string | null
  }

  export type UserCreateWithoutRespondentInput = {
    id?: string
    email: string
    password_hash: string
    role: string
    created_at?: Date | string
    templates?: TemplateCreateNestedManyWithoutResearcherInput
    sessions?: SessionCreateNestedManyWithoutRespondentInput
  }

  export type UserUncheckedCreateWithoutRespondentInput = {
    id?: string
    email: string
    password_hash: string
    role: string
    created_at?: Date | string
    templates?: TemplateUncheckedCreateNestedManyWithoutResearcherInput
    sessions?: SessionUncheckedCreateNestedManyWithoutRespondentInput
  }

  export type UserCreateOrConnectWithoutRespondentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRespondentInput, UserUncheckedCreateWithoutRespondentInput>
  }

  export type IncentiveCreateWithoutRespondentInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    status: string
    paid_at?: Date | string | null
    session: SessionCreateNestedOneWithoutIncentivesInput
  }

  export type IncentiveUncheckedCreateWithoutRespondentInput = {
    id?: string
    session_id: string
    amount: Decimal | DecimalJsLike | number | string
    status: string
    paid_at?: Date | string | null
  }

  export type IncentiveCreateOrConnectWithoutRespondentInput = {
    where: IncentiveWhereUniqueInput
    create: XOR<IncentiveCreateWithoutRespondentInput, IncentiveUncheckedCreateWithoutRespondentInput>
  }

  export type IncentiveCreateManyRespondentInputEnvelope = {
    data: IncentiveCreateManyRespondentInput | IncentiveCreateManyRespondentInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutRespondentInput = {
    update: XOR<UserUpdateWithoutRespondentInput, UserUncheckedUpdateWithoutRespondentInput>
    create: XOR<UserCreateWithoutRespondentInput, UserUncheckedCreateWithoutRespondentInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRespondentInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRespondentInput, UserUncheckedUpdateWithoutRespondentInput>
  }

  export type UserUpdateWithoutRespondentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    templates?: TemplateUpdateManyWithoutResearcherNestedInput
    sessions?: SessionUpdateManyWithoutRespondentNestedInput
  }

  export type UserUncheckedUpdateWithoutRespondentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    templates?: TemplateUncheckedUpdateManyWithoutResearcherNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutRespondentNestedInput
  }

  export type IncentiveUpsertWithWhereUniqueWithoutRespondentInput = {
    where: IncentiveWhereUniqueInput
    update: XOR<IncentiveUpdateWithoutRespondentInput, IncentiveUncheckedUpdateWithoutRespondentInput>
    create: XOR<IncentiveCreateWithoutRespondentInput, IncentiveUncheckedCreateWithoutRespondentInput>
  }

  export type IncentiveUpdateWithWhereUniqueWithoutRespondentInput = {
    where: IncentiveWhereUniqueInput
    data: XOR<IncentiveUpdateWithoutRespondentInput, IncentiveUncheckedUpdateWithoutRespondentInput>
  }

  export type IncentiveUpdateManyWithWhereWithoutRespondentInput = {
    where: IncentiveScalarWhereInput
    data: XOR<IncentiveUpdateManyMutationInput, IncentiveUncheckedUpdateManyWithoutRespondentInput>
  }

  export type RespondentCreateWithoutIncentivesInput = {
    id?: string
    name: string
    demographics?: NullableJsonNullValueInput | InputJsonValue
    participation_count?: number
    total_incentives?: Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: Decimal | DecimalJsLike | number | string | null
    behavior_tags?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutRespondentInput
  }

  export type RespondentUncheckedCreateWithoutIncentivesInput = {
    id?: string
    user_id: string
    name: string
    demographics?: NullableJsonNullValueInput | InputJsonValue
    participation_count?: number
    total_incentives?: Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: Decimal | DecimalJsLike | number | string | null
    behavior_tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RespondentCreateOrConnectWithoutIncentivesInput = {
    where: RespondentWhereUniqueInput
    create: XOR<RespondentCreateWithoutIncentivesInput, RespondentUncheckedCreateWithoutIncentivesInput>
  }

  export type SessionCreateWithoutIncentivesInput = {
    id?: string
    status: string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: string | null
    sentiment_score?: Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: Date | string | null
    completed_at?: Date | string | null
    duration_seconds?: number | null
    template: TemplateCreateNestedOneWithoutSessionsInput
    respondent: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateWithoutIncentivesInput = {
    id?: string
    template_id: string
    respondent_id: string
    status: string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: string | null
    sentiment_score?: Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: Date | string | null
    completed_at?: Date | string | null
    duration_seconds?: number | null
  }

  export type SessionCreateOrConnectWithoutIncentivesInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutIncentivesInput, SessionUncheckedCreateWithoutIncentivesInput>
  }

  export type RespondentUpsertWithoutIncentivesInput = {
    update: XOR<RespondentUpdateWithoutIncentivesInput, RespondentUncheckedUpdateWithoutIncentivesInput>
    create: XOR<RespondentCreateWithoutIncentivesInput, RespondentUncheckedCreateWithoutIncentivesInput>
    where?: RespondentWhereInput
  }

  export type RespondentUpdateToOneWithWhereWithoutIncentivesInput = {
    where?: RespondentWhereInput
    data: XOR<RespondentUpdateWithoutIncentivesInput, RespondentUncheckedUpdateWithoutIncentivesInput>
  }

  export type RespondentUpdateWithoutIncentivesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    demographics?: NullableJsonNullValueInput | InputJsonValue
    participation_count?: IntFieldUpdateOperationsInput | number
    total_incentives?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    behavior_tags?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutRespondentNestedInput
  }

  export type RespondentUncheckedUpdateWithoutIncentivesInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    demographics?: NullableJsonNullValueInput | InputJsonValue
    participation_count?: IntFieldUpdateOperationsInput | number
    total_incentives?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_sentiment?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    behavior_tags?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SessionUpsertWithoutIncentivesInput = {
    update: XOR<SessionUpdateWithoutIncentivesInput, SessionUncheckedUpdateWithoutIncentivesInput>
    create: XOR<SessionCreateWithoutIncentivesInput, SessionUncheckedCreateWithoutIncentivesInput>
    where?: SessionWhereInput
  }

  export type SessionUpdateToOneWithWhereWithoutIncentivesInput = {
    where?: SessionWhereInput
    data: XOR<SessionUpdateWithoutIncentivesInput, SessionUncheckedUpdateWithoutIncentivesInput>
  }

  export type SessionUpdateWithoutIncentivesInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration_seconds?: NullableIntFieldUpdateOperationsInput | number | null
    template?: TemplateUpdateOneRequiredWithoutSessionsNestedInput
    respondent?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateWithoutIncentivesInput = {
    id?: StringFieldUpdateOperationsInput | string
    template_id?: StringFieldUpdateOperationsInput | string
    respondent_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration_seconds?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type TemplateCreateManyResearcherInput = {
    id?: string
    title: string
    topic?: string | null
    starter_questions: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
  }

  export type SessionCreateManyRespondentInput = {
    id?: string
    template_id: string
    status: string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: string | null
    sentiment_score?: Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: Date | string | null
    completed_at?: Date | string | null
    duration_seconds?: number | null
  }

  export type TemplateUpdateWithoutResearcherInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    starter_questions?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutTemplateNestedInput
  }

  export type TemplateUncheckedUpdateWithoutResearcherInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    starter_questions?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutTemplateNestedInput
  }

  export type TemplateUncheckedUpdateManyWithoutResearcherInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    starter_questions?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUpdateWithoutRespondentInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration_seconds?: NullableIntFieldUpdateOperationsInput | number | null
    template?: TemplateUpdateOneRequiredWithoutSessionsNestedInput
    incentives?: IncentiveUpdateManyWithoutSessionNestedInput
  }

  export type SessionUncheckedUpdateWithoutRespondentInput = {
    id?: StringFieldUpdateOperationsInput | string
    template_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration_seconds?: NullableIntFieldUpdateOperationsInput | number | null
    incentives?: IncentiveUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type SessionUncheckedUpdateManyWithoutRespondentInput = {
    id?: StringFieldUpdateOperationsInput | string
    template_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration_seconds?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SessionCreateManyTemplateInput = {
    id?: string
    respondent_id: string
    status: string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: string | null
    sentiment_score?: Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: Date | string | null
    completed_at?: Date | string | null
    duration_seconds?: number | null
  }

  export type SessionUpdateWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration_seconds?: NullableIntFieldUpdateOperationsInput | number | null
    respondent?: UserUpdateOneRequiredWithoutSessionsNestedInput
    incentives?: IncentiveUpdateManyWithoutSessionNestedInput
  }

  export type SessionUncheckedUpdateWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    respondent_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration_seconds?: NullableIntFieldUpdateOperationsInput | number | null
    incentives?: IncentiveUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type SessionUncheckedUpdateManyWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    respondent_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    transcript?: NullableJsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    key_themes?: NullableJsonNullValueInput | InputJsonValue
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duration_seconds?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type IncentiveCreateManySessionInput = {
    id?: string
    respondent_id: string
    amount: Decimal | DecimalJsLike | number | string
    status: string
    paid_at?: Date | string | null
  }

  export type IncentiveUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    paid_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    respondent?: RespondentUpdateOneRequiredWithoutIncentivesNestedInput
  }

  export type IncentiveUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    respondent_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    paid_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IncentiveUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    respondent_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    paid_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IncentiveCreateManyRespondentInput = {
    id?: string
    session_id: string
    amount: Decimal | DecimalJsLike | number | string
    status: string
    paid_at?: Date | string | null
  }

  export type IncentiveUpdateWithoutRespondentInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    paid_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    session?: SessionUpdateOneRequiredWithoutIncentivesNestedInput
  }

  export type IncentiveUncheckedUpdateWithoutRespondentInput = {
    id?: StringFieldUpdateOperationsInput | string
    session_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    paid_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IncentiveUncheckedUpdateManyWithoutRespondentInput = {
    id?: StringFieldUpdateOperationsInput | string
    session_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    paid_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TemplateCountOutputTypeDefaultArgs instead
     */
    export type TemplateCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TemplateCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SessionCountOutputTypeDefaultArgs instead
     */
    export type SessionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SessionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RespondentCountOutputTypeDefaultArgs instead
     */
    export type RespondentCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RespondentCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TemplateDefaultArgs instead
     */
    export type TemplateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TemplateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SessionDefaultArgs instead
     */
    export type SessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RespondentDefaultArgs instead
     */
    export type RespondentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RespondentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use IncentiveDefaultArgs instead
     */
    export type IncentiveArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = IncentiveDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}