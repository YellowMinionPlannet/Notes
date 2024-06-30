# section 8
- `sling:resourceSuperType` can inherit cq:dialog from superType, and also html template in superType by `data-sly-include`

- [Global Object documentation](https://experienceleague.adobe.com/en/docs/experience-manager-htl/content/global-objects)

- [USE-API](https://experienceleague.adobe.com/en/docs/experience-manager-htl/content/java-use-api), where JAVA object kicks in. All global objects are addition to the context of USE-API.

- `resourceResolver.findResource @ path=resource.resourceType`

- `<a data-sly-use.childJcrContent="${item.path}/jcr:content" href="${item.path @ extention='html'}">${childJcrContent.jcr:title}</a>`

# section 9 Editable Templates
- `/content/my-site` `cq:allowedTemplates="/conf/my-site/settings/wcm/templates/.*"`
  - `/content/my-site/my-page/jcr:content` `cq:template="/conf/my-site/settings/wcm/templates/my-template"`
    - `/content/my-site/my-page/jcr:content/root/my-component` `sling:resourceType="/apps/my-site/components/title"`