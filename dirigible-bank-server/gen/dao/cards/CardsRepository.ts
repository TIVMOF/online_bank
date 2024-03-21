import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface CardsEntity {
    readonly Id: number;
    Users?: number;
    CardNumber: string;
    ExpirationDate?: Date;
    CardType: number;
}

export interface CardsCreateEntity {
    readonly Users?: number;
    readonly CardNumber: string;
    readonly ExpirationDate?: Date;
    readonly CardType: number;
}

export interface CardsUpdateEntity extends CardsCreateEntity {
    readonly Id: number;
}

export interface CardsEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Users?: number | number[];
            CardNumber?: string | string[];
            ExpirationDate?: Date | Date[];
            CardType?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Users?: number | number[];
            CardNumber?: string | string[];
            ExpirationDate?: Date | Date[];
            CardType?: number | number[];
        };
        contains?: {
            Id?: number;
            Users?: number;
            CardNumber?: string;
            ExpirationDate?: Date;
            CardType?: number;
        };
        greaterThan?: {
            Id?: number;
            Users?: number;
            CardNumber?: string;
            ExpirationDate?: Date;
            CardType?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Users?: number;
            CardNumber?: string;
            ExpirationDate?: Date;
            CardType?: number;
        };
        lessThan?: {
            Id?: number;
            Users?: number;
            CardNumber?: string;
            ExpirationDate?: Date;
            CardType?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Users?: number;
            CardNumber?: string;
            ExpirationDate?: Date;
            CardType?: number;
        };
    },
    $select?: (keyof CardsEntity)[],
    $sort?: string | (keyof CardsEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface CardsEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<CardsEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class CardsRepository {

    private static readonly DEFINITION = {
        table: "PI_CARDS",
        properties: [
            {
                name: "Id",
                column: "CARDS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Users",
                column: "CARDS_USERS",
                type: "INTEGER",
            },
            {
                name: "CardNumber",
                column: "CARDS_CARDNUMBER",
                type: "VARCHAR",
                required: true
            },
            {
                name: "ExpirationDate",
                column: "CARDS_EXPIRATIONDATE",
                type: "DATE",
            },
            {
                name: "CardType",
                column: "CARDS_CARDTYPE",
                type: "INTEGER",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(CardsRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: CardsEntityOptions): CardsEntity[] {
        return this.dao.list(options).map((e: CardsEntity) => {
            EntityUtils.setDate(e, "ExpirationDate");
            return e;
        });
    }

    public findById(id: number): CardsEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "ExpirationDate");
        return entity ?? undefined;
    }

    public create(entity: CardsCreateEntity): number {
        EntityUtils.setLocalDate(entity, "ExpirationDate");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "PI_CARDS",
            entity: entity,
            key: {
                name: "Id",
                column: "CARDS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: CardsUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "ExpirationDate");
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "PI_CARDS",
            entity: entity,
            key: {
                name: "Id",
                column: "CARDS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: CardsCreateEntity | CardsUpdateEntity): number {
        const id = (entity as CardsUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as CardsUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "PI_CARDS",
            entity: entity,
            key: {
                name: "Id",
                column: "CARDS_ID",
                value: id
            }
        });
    }

    public count(options?: CardsEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "PI_CARDS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: CardsEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("dirigible-bank-server-cards-Cards", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("dirigible-bank-server/cards/Cards").send(JSON.stringify(data));
    }
}