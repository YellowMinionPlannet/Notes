# Template Authoring

left rail right button, edit template(page template).

Pages (Multiple) => (1) Template (1) => (Multiple) components (1) => (1) component policy.

1 template can inherit to multiple pages. 1 template can have multiple allowed component, each of which has one policy. So two different template can have same type of allowed compoent but with different component policies.

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

## Set root path

path=/content/wknd/us/en/articles

## Set which primaryType

path=/content/wknd/us/en/articles
type=cq:Page

## How does resource resolver works

Browser => content node => apps node(component) => sling model => resource(content node) => Resource Resolver => Session / QueryBuilder

### How does OSGI Framework works

Our model is a bundle, and our resource(content node) is another bundle, so one bundle needs another bundle, the OSGI Framework will inject. And Resource Resolver is within that OSGI Framwork, so call resource resolver in model will get you the resource.

```java
@Model(adaptables = Resource.calss, defaultInjectionStrategy = DfaultInjectionStrategy.OPTIONAL)
public class ArticleListModel{
    private static final Logger LOGGER = LoggerFactory.getLogger(ArticleListModel.class);
    // under /system/console/slinglog, add new logger, debug level, logfile=logs/articlelog.log, logger=com.adobe.aem.guides.wknd.core.models.ArticleListModel

    @Self
    Resource resource;

    @Inject
    private String articleRootPath;

    public String getArticleRootPath() {return articleRootPath;}

    List<ArticleListDataBean> array = null;

    @PostConstruct
    protected void init(){
        ResourceResolver resourceResolver = resource.getResourceResolver();
        Session session = resourceResolver.adapTo(Session.class);
        QueryBuilder builder = resourceResolver.adaptTo(QueryBuilder.class);

        Map<String, String> predicate = new HashMap();
        predicate.put("path", articleRootPath);
        predicate.purt("type", "cq:Page");

        Query query = null;
        try{
            query = builder.createQuery(PredicateGroup.create(predicate), session);
        }catch(Exception e){
            LOGGER.error("Error in Query", e);
        }

        SearchResult searchResult = query.getResult();
        array = new ArrayList<ArticleListDataBean>();

        for(Hit hit: searchResult.getHits()){
            String path = null;
            try{
                ArticleListDataBean item = new ArticleListDataBean();

                path = hit.getPath();
                Resource articleResource = resourceResolver.getResource(path);
                Page articlePage = articleResource.adaptTo(Page.class);
                String navTitle = articlePage.getNavigationTitle();
                String description = articlePage.getDescription();

                item.setPath(path);
                item.setTitle(navTitle);
                item.setDescription(description);

                list.add(item);

                LOGGER.debug("Navigation Title: {}, Description {}", navTitle, description);
            }catch(Exception e){
                throw new RuntimeException(e);
            }
        }

    }

    public List<ArticleListDataBean> getArray(){
        return array;
    }
}
```

Then we create Beans to store articles info retrieved by the query builder.

```java
public class ArticleListDataBean{
    private String path;
    private String title;
    private String description;

    public String getDescription{
        return description;
    }

    public String getTitle{
        return title;
    }

    public String getPath{
        return path;
    }

    public void setDescription(String description){
        this.description = description;
    }

    public void setTitle(String title){
        this.title = title;
    }

    public void setPath(String path){
        this.path = path;
    }

}
```

Now we need to use the array in HTL

```html
<h1>This is the Article List component</h1>
<sly
  data-sly-use.model="com.adobe.aem.guides.wknd.core.models.ArticleListModel"
>
  ${model.articleRootPath}
  <sly data-sly-list.array="${model.array}">
    <div>
      <h2>${array.path}</h2>
      <p>${array.description}</p>
      <a href="${array.path}">Explore more...</a>
    </div>
  </sly>
</sly>
```

# Add CSS to AEM component

```html
<sly
  data-sly-use.clientlib="/libs/granite/sightly/templates/clientlib.html"
  data-sly-call="${clientlib.all @ categories='wknd.articlelist'}"
/>
<div class="cmp-articlelist">
  <h1 class="cmp-articlelist__heading">This is the Article List component</h1>
  <div
    class="cmp-articlelist__cards-container"
    data-sly-use.model="com.adobe.aem.guides.wknd.core.models.ArticleListModel"
  >
    ${model.articleRootPath}
    <sly data-sly-list.array="${model.array}">
      <div class="cmp-articlelist__card">
        <div class="cmp-articlelist__card-title">${array.title}</div>
        <div class="cmp-articlelist__card-description">
          ${array.description}
        </div>
        <div class="cmp-articlelist__card-btn-container">
          <a class="cmp-articlelist__card-btn" href="${array.path}"
            >Explore more...</a
          >
        </div>
      </div>
    </sly>
  </div>
</div>
<style>
  .cmp-articlelist__cards-container {
    display: flex;
  }
  .cmp-articlelist__card {
    display: flex;
    flex-direction: column;
    padding: 10px;
    width: 350px;
    height: 330px;
  }
  .cmp-articlelist__card-btn {
    padding: 15px 40px;
    background-color: #5e7263;
    color: #fff;
    text-align: center;
  }
</style>
```

Create clinetlibs node as jcr:primaryType: cq:ClinetLibraryFolder, under articlelist component node. css folder, js folderand, .content.xml, css.txt, js.txt under clientlibs.

```txt
<!-- css.txt -->
#base=css
articlelist.css
```

```css
.cmp-articlelist__cards-container {
  display: flex;
}
.cmp-articlelist__card {
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 350px;
  height: 330px;
}
.cmp-articlelist__card-btn {
  padding: 15px 40px;
  background-color: #5e7263;
  color: #fff;
  text-align: center;
}
```

# Add CSS Variations to AEM Component

cq:design_dialog must be valid, and we can select our componnet's policy at Edit Template (button at left rail).

```scss
.cmp-articlelist--grey-background {
  .cmp-articlelist__card {
    background-color: grey;
  }
}

.cmp-articlelist--white-background {
  .cmp-articlelist__card {
    background-color: white;
  }
}

.cmp-articlelist__cards-container {
  display: flex;
}
.cmp-articlelist__card {
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 350px;
  height: 330px;
}
.cmp-articlelist__card-btn {
  padding: 15px 40px;
  background-color: #5e7263;
  color: #fff;
  text-align: center;
}
```

We create style within a group, may be called background-color/theme/whatever, and style name as name that displays to the author at bruch button, and class name is the cmp-articlelist--grey-background/cmp-articlelist--white-background.

That brush selected will inject the class to the root of the component div tag.
