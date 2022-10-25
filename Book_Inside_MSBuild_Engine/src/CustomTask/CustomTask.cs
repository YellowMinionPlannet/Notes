using System;
using Microsoft.Build.Framework;
using Microsoft.Build.Utilities;

namespace CustomTask
{
    public class MetadataExample : Task
    {
        [Required]
        public ITaskItem[] ServerList { get; set; }
        [Output]
        public ITaskItem[] Result { get; set; }
        public override bool Execute()
        {
            if(ServerList.Length > 0)
            {
                Result = new ITaskItem[ServerList.Length];

                for(var i = 0; i < Result.Length ; i++)
                {
                    var item = ServerList[i];
                    var newItem = new TaskItem(item.ItemSpec);
                    var fullpath = item.GetMetadata("Fullpath");

                    Log.LogMessageFromText(fullpath, MessageImportance.High);

                    newItem.SetMetadata("ServerName", item.GetMetadata("Name"));
                    newItem.SetMetadata("DropLoc", item.GetMetadata("DropLocation"));

                    newItem.SetMetadata("IpAddress", $"127.0.0.{i}");
                    Result[i] = newItem;
                }
            }
            return true;
        }
    }
}
