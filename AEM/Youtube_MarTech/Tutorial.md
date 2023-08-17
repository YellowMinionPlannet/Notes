# Global Object

The traditional flow of MVC in AEM

Browser => Controller => Sling Model => database => Sling Model => HTL => Controller => Browser

The global object flow

Browser => Controller => View => Global Object => View => Controller => Browser

# Sling Model

@Model tells sling that this is the Sling model used by specific resource(content folder resource).

adaptables resource class will be adapted to something, and the resource class is adapt to a ValueMap, which is the source properties of current model.

@Inject means we inject property from the ValueMap to this model and get the property's value.

Every Injeced property is required by default. We can use defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL to set all injected property is optional, so no errors raised if property name not found.

@PostConstruct means the method will execute when all properties are injected.

# QueryBuilder

/libs/cq/search/content/querydebug.html
